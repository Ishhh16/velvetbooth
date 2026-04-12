import { motion } from 'framer-motion';
import { useBoothStore } from '@/store/boothStore';

const stickerEmojis = ['😎', '🎩', '👑', '💖', '⭐', '🌸', '🎀', '✨', '🎭', '📸', '🎬', '🎞️'];

const StickerPanel = () => {
  const { addSticker } = useBoothStore();

  const handleAdd = (emoji: string) => {
    addSticker({
      id: `sticker-${Date.now()}-${Math.random()}`,
      emoji,
      x: 50 + Math.random() * 200,
      y: 50 + Math.random() * 100,
      scale: 1,
      rotation: Math.random() * 30 - 15,
    });
  };

  return (
    <div>
      <p className="font-typewriter text-xs tracking-widest text-muted-foreground mb-3">✦ STICKERS</p>
      <div className="flex gap-2 flex-wrap">
        {stickerEmojis.map((emoji) => (
          <motion.button
            key={emoji}
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => handleAdd(emoji)}
            className="w-10 h-10 rounded-sm border border-border hover:border-foreground flex items-center justify-center text-xl transition-colors"
          >
            {emoji}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default StickerPanel;
