import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Type, Trash2, Maximize2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useBoothStore, type LayoutType } from '@/store/boothStore';

const PhotoStrip = () => {
  const stripRef = useRef<HTMLDivElement>(null);
  const {
    photos, selectedLayout, stickers, textOverlays,
    removePhoto, clearStickers, updateSticker, removeSticker,
    addTextOverlay, updateTextOverlay, removeTextOverlay,
  } = useBoothStore();

  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizing, setResizing] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, scale: 1, fontSize: 16 });

  const requiredPhotos: Record<LayoutType, number> = {
    single: 1,
    'vertical-2': 2,
    'strip-3': 3,
    'grid-4': 4,
    'grid-2x3': 6,
  };

  const needed = requiredPhotos[selectedLayout];
  const displayPhotos = photos.slice(0, needed);
  const ready = displayPhotos.length >= needed;

  const exportStrip = async () => {
    if (!stripRef.current) return;
    const canvas = await html2canvas(stripRef.current, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
    });
    const link = document.createElement('a');
    link.download = `velvetbooth-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const layoutClass: Record<LayoutType, string> = {
    single: 'grid-cols-1',
    'vertical-2': 'grid-cols-1',
    'strip-3': 'grid-cols-1',
    'grid-4': 'grid-cols-2',
    'grid-2x3': 'grid-cols-2',
  };

  const handleAddText = () => {
    addTextOverlay({
      id: `text-${Date.now()}`,
      text: 'your text here',
      x: 40,
      y: 40,
      fontSize: 16,
      rotation: -3,
    });
  };

  const handlePointerDown = (id: string, type: 'sticker' | 'text', e: React.PointerEvent) => {
    e.preventDefault();
    if (resizing) return;
    const rect = stripRef.current?.getBoundingClientRect();
    if (!rect) return;

    const item = type === 'sticker'
      ? stickers.find(s => s.id === id)
      : textOverlays.find(t => t.id === id);
    if (!item) return;

    setDragging(id);
    setDragOffset({
      x: e.clientX - rect.left - item.x,
      y: e.clientY - rect.top - item.y,
    });
  };

  const handleResizeDown = (id: string, type: 'sticker' | 'text', e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing(id);
    const item = type === 'sticker'
      ? stickers.find(s => s.id === id)
      : textOverlays.find(t => t.id === id);
    if (!item) return;
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      scale: 'scale' in item ? item.scale : 1,
      fontSize: 'fontSize' in item ? item.fontSize : 16,
    });
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (resizing) {
      const dx = e.clientX - resizeStart.x;
      const sticker = stickers.find(s => s.id === resizing);
      if (sticker) {
        const newScale = Math.max(0.3, Math.min(4, resizeStart.scale + dx * 0.01));
        updateSticker(resizing, { scale: newScale });
        return;
      }
      const text = textOverlays.find(t => t.id === resizing);
      if (text) {
        const newSize = Math.max(10, Math.min(60, resizeStart.fontSize + dx * 0.3));
        updateTextOverlay(resizing, { fontSize: newSize });
      }
      return;
    }

    if (!dragging || !stripRef.current) return;
    const rect = stripRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    const sticker = stickers.find(s => s.id === dragging);
    if (sticker) {
      updateSticker(dragging, { x: newX, y: newY });
      return;
    }
    const text = textOverlays.find(t => t.id === dragging);
    if (text) {
      updateTextOverlay(dragging, { x: newX, y: newY });
    }
  }, [dragging, resizing, dragOffset, resizeStart, stickers, textOverlays, updateSticker, updateTextOverlay]);

  const handlePointerUp = () => {
    setDragging(null);
    setResizing(null);
  };

  if (photos.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="font-typewriter text-sm text-muted-foreground">
          📷 Take some photos to see your strip here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Strip preview */}
      <motion.div
        whileHover={{ scale: 1.02, rotate: 0.5 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        ref={stripRef}
        className="bg-primary-foreground p-4 rounded-sm vintage-shadow mx-auto inline-block relative"
        style={{ maxWidth: selectedLayout === 'grid-4' || selectedLayout === 'grid-2x3' ? 400 : 240 }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div className={`grid ${layoutClass[selectedLayout]} gap-2`}>
          <AnimatePresence>
            {displayPhotos.map((photo, i) => (
              <motion.div
                key={`photo-${i}`}
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="relative group"
              >
                <img
                  src={photo}
                  alt={`Photo ${i + 1}`}
                  className="w-full rounded-[2px] border border-border"
                />
                <button
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-foreground/70 text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Draggable + resizable stickers */}
        {stickers.map((s) => (
          <div
            key={s.id}
            className="absolute cursor-grab active:cursor-grabbing select-none group/sticker"
            style={{
              left: s.x,
              top: s.y,
              transform: `scale(${s.scale}) rotate(${s.rotation}deg)`,
              touchAction: 'none',
            }}
            onPointerDown={(e) => handlePointerDown(s.id, 'sticker', e)}
          >
            <span className="text-3xl">{s.emoji}</span>
            <button
              onClick={() => removeSticker(s.id)}
              className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-[8px] opacity-0 group-hover/sticker:opacity-100 transition-opacity"
            >
              ×
            </button>
            <div
              onPointerDown={(e) => handleResizeDown(s.id, 'sticker', e)}
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-accent text-accent-foreground flex items-center justify-center cursor-se-resize opacity-0 group-hover/sticker:opacity-100 transition-opacity"
            >
              <Maximize2 className="w-2.5 h-2.5" />
            </div>
          </div>
        ))}

        {/* Draggable + resizable text overlays */}
        {textOverlays.map((t) => (
          <div
            key={t.id}
            className="absolute cursor-grab active:cursor-grabbing select-none group/text"
            style={{
              left: t.x,
              top: t.y,
              transform: `rotate(${t.rotation}deg)`,
              touchAction: 'none',
            }}
            onPointerDown={(e) => handlePointerDown(t.id, 'text', e)}
          >
            <span
              contentEditable
              suppressContentEditableWarning
              className="font-cursive text-foreground outline-none border-b border-dashed border-transparent focus:border-foreground/30"
              style={{ fontSize: t.fontSize }}
              onBlur={(e) => updateTextOverlay(t.id, { text: e.currentTarget.textContent || '' })}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {t.text}
            </span>
            <button
              onClick={() => removeTextOverlay(t.id)}
              className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-[8px] opacity-0 group-hover/text:opacity-100 transition-opacity"
            >
              ×
            </button>
            <div
              onPointerDown={(e) => handleResizeDown(t.id, 'text', e)}
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-accent text-accent-foreground flex items-center justify-center cursor-se-resize opacity-0 group-hover/text:opacity-100 transition-opacity"
            >
              <Maximize2 className="w-2.5 h-2.5" />
            </div>
          </div>
        ))}

        {/* Timestamp */}
        <p className="font-typewriter text-[9px] text-center text-muted-foreground mt-3">
          {new Date().toLocaleDateString()} • velvetbooth ✦
        </p>
      </motion.div>

      {/* Status */}
      {!ready && (
        <p className="font-typewriter text-xs text-center text-muted-foreground">
          {displayPhotos.length}/{needed} photos taken
        </p>
      )}

      {/* Controls */}
      {photos.length > 0 && (
        <div className="flex gap-3 justify-center flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportStrip}
            className="font-typewriter text-sm bg-foreground text-primary-foreground px-6 py-3 rounded-sm vintage-shadow flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Strip
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddText}
            className="font-typewriter text-xs border border-border px-4 py-2 rounded-sm hover:border-foreground transition-colors flex items-center gap-1"
          >
            <Type className="w-3 h-3" />
            Add Text
          </motion.button>
          {(stickers.length > 0 || textOverlays.length > 0) && (
            <button
              onClick={() => {
                clearStickers();
                useBoothStore.getState().textOverlays.forEach(t =>
                  useBoothStore.getState().removeTextOverlay(t.id)
                );
              }}
              className="font-typewriter text-xs border border-border px-4 py-2 rounded-sm hover:border-foreground transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Clear All
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PhotoStrip;
