import { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RotateCcw, Timer } from 'lucide-react';
import { useBoothStore, type FilterType } from '@/store/boothStore';

const filterStyles: Record<FilterType, string> = {
  none: '',
  vintage: 'sepia(0.4) saturate(1.3) contrast(1.1) brightness(1.05)',
  bw: 'grayscale(1) contrast(1.2)',
  sepia: 'sepia(0.8) contrast(1.1)',
  vhs: 'saturate(1.5) contrast(1.3) brightness(1.1) hue-rotate(5deg)',
};

const playShutterSound = () => {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'square';
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.12);
};

const CameraFrame = () => {
  const webcamRef = useRef<Webcam>(null);
  const { addPhoto, activeFilter, countdown, setCountdown, isCapturing, setIsCapturing } = useBoothStore();
  const [flash, setFlash] = useState(false);

  const capture = useCallback(() => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      playShutterSound();
      setFlash(true);
      setTimeout(() => setFlash(false), 300);

      if (activeFilter !== 'none') {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d')!;
          ctx.filter = filterStyles[activeFilter];
          ctx.drawImage(img, 0, 0);
          addPhoto(canvas.toDataURL('image/png'));
        };
        img.src = screenshot;
      } else {
        addPhoto(screenshot);
      }
    }
  }, [addPhoto, activeFilter]);

  const startCountdown = useCallback(() => {
    setIsCapturing(true);
    let count = 3;
    setCountdown(count);
    const interval = setInterval(() => {
      count--;
      if (count <= 0) {
        clearInterval(interval);
        setCountdown(null);
        capture();
        setIsCapturing(false);
      } else {
        setCountdown(count);
      }
    }, 1000);
  }, [capture, setCountdown, setIsCapturing]);

  const startBurstMode = useCallback(() => {
    setIsCapturing(true);
    let shots = 0;
    const total = 3;

    const takeShot = () => {
      let count = 3;
      setCountdown(count);
      const interval = setInterval(() => {
        count--;
        if (count <= 0) {
          clearInterval(interval);
          setCountdown(null);
          capture();
          shots++;
          if (shots < total) {
            setTimeout(takeShot, 500);
          } else {
            setIsCapturing(false);
          }
        } else {
          setCountdown(count);
        }
      }, 1000);
    };

    takeShot();
  }, [capture, setCountdown, setIsCapturing]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="camera-frame w-full max-w-lg aspect-[4/3] bg-foreground/5 relative">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/png"
          mirrored
          className="w-full h-full object-cover"
          style={{ filter: filterStyles[activeFilter] }}
          videoConstraints={{ facingMode: 'user', width: 640, height: 480 }}
        />

        <AnimatePresence>
          {countdown !== null && (
            <motion.div
              key={countdown}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-foreground/30"
            >
              <span className="font-display text-8xl font-black text-primary-foreground drop-shadow-lg">
                {countdown}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {flash && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-primary-foreground pointer-events-none"
            />
          )}
        </AnimatePresence>

        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-foreground/40" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-foreground/40" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-foreground/40" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-foreground/40" />
      </div>

      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={startCountdown}
          disabled={isCapturing}
          className="w-16 h-16 rounded-full bg-foreground text-primary-foreground flex items-center justify-center vintage-shadow disabled:opacity-50"
        >
          <Camera className="w-7 h-7" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={startBurstMode}
          disabled={isCapturing}
          className="w-12 h-12 rounded-full border-2 border-foreground text-foreground flex items-center justify-center disabled:opacity-50"
          title="Burst mode (3 shots)"
        >
          <Timer className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => useBoothStore.getState().clearPhotos()}
          className="w-12 h-12 rounded-full border-2 border-foreground text-foreground flex items-center justify-center"
          title="Clear all"
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default CameraFrame;
