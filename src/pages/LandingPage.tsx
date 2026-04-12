import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, Sparkles, Image, Download, Film, Aperture } from 'lucide-react';
import vintageCamera from '@/assets/vintage-camera.png';
import { useBoothStore } from '@/store/boothStore';

const LandingPage = () => {
  const navigate = useNavigate();
  const { photos } = useBoothStore();
  const previewPhotos = photos.slice(-3);
  return (
    <div className="min-h-screen bg-background grain-overlay">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          ✦ <span className="italic">velvetbooth</span>
        </h1>
        <button
          onClick={() => navigate('/booth')}
          className="font-typewriter text-sm border-2 border-foreground px-5 py-2 rounded-sm hover:bg-foreground hover:text-primary-foreground transition-colors"
        >
          START BOOTH
        </button>
      </nav>

      {/* Hero */}
      <section className="relative px-6 md:px-12 pt-12 pb-20 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/3 flex justify-center"
          >
            <img
              src={vintageCamera}
              alt="Vintage camera"
              className="w-56 md:w-72 animate-float drop-shadow-lg"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:w-2/3"
          >
            <p className="font-typewriter text-sm tracking-[0.3em] text-muted-foreground mb-3">
              ✦ YOUR DIGITAL PHOTOBOOTH
            </p>
            <h2 className="font-display text-5xl md:text-7xl font-black leading-[1.05] mb-4">
              Capture the moment.<br />
              <span className="italic">Keep the feeling.</span> 🎞️
            </h2>
            <div className="w-full h-1 bg-foreground mb-6" />
            <p className="font-body text-muted-foreground text-lg max-w-lg mb-8">
              Step into our digital booth — snap photos, apply retro filters,
              add stickers, and export beautiful photostrips.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/booth')}
              className="font-typewriter bg-foreground text-primary-foreground px-8 py-4 text-lg rounded-sm vintage-shadow hover:opacity-90 transition-opacity"
            >
              Step into the booth →
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Animated Preview */}
      <section className="py-16 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-card p-6 vintage-shadow"
          >
            <div className="flex gap-3">
              {previewPhotos.length > 0
                ? previewPhotos.map((photo, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
                      className="w-28 h-36 md:w-36 md:h-48 rounded-sm border border-border overflow-hidden"
                    >
                      <img src={photo} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                    </motion.div>
                  ))
                : [1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
                      className="w-28 h-36 md:w-36 md:h-48 bg-secondary rounded-sm border border-border flex items-center justify-center"
                    >
                      <Camera className="w-8 h-8 text-muted-foreground/40" />
                    </motion.div>
                  ))
              }
            </div>
            <p className="font-typewriter text-xs text-center text-muted-foreground mt-4">
              ✦ your photostrip preview ✦
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 md:px-12 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-typewriter text-sm tracking-[0.3em] text-muted-foreground mb-2">✦ FEATURES</p>
          <h3 className="font-display text-4xl font-bold italic">Everything you need</h3>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Aperture, title: 'Vintage Filters', desc: 'Sepia, B&W, VHS grain & more' },
            { icon: Film, title: 'Photostrips', desc: 'Classic booth layouts' },
            { icon: Sparkles, title: 'Fun Stickers', desc: 'Drag, resize & rotate' },
            { icon: Download, title: 'Easy Export', desc: 'Download as PNG instantly' },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass-card p-6 vintage-shadow text-center"
            >
              <f.icon className="w-8 h-8 mx-auto mb-3 text-accent" />
              <h4 className="font-display text-lg font-bold mb-1">{f.title}</h4>
              <p className="font-body text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Problem / Solved */}
      <section className="py-16 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-typewriter text-sm text-muted-foreground mb-3">✦ Problem...</p>
            <p className="font-display text-3xl italic leading-snug mb-2">
              Find a photobooth<span className="text-accent">??</span>
            </p>
            <p className="font-display text-3xl italic leading-snug mb-2">
              Pay per session
            </p>
            <p className="font-display text-3xl italic leading-snug">
              Limited filters
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-typewriter text-sm text-muted-foreground mb-3">...solved ✦</p>
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              With our digital photobooth, capture unlimited photos right from your browser.
              Vintage filters, fun stickers, and classic photostrip layouts — all free, all instant.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="font-display text-4xl md:text-5xl font-black italic mb-6">
            Ready to snap? 📸
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/booth')}
            className="font-typewriter bg-foreground text-primary-foreground px-10 py-4 text-lg rounded-sm vintage-shadow"
          >
            Step into the booth →
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center border-t border-border">
        <p className="font-typewriter text-xs text-muted-foreground">
          ✦ Made with nostalgia ✦
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
