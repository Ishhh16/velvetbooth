import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import CameraFrame from '@/components/booth/CameraFrame';
import FilterPanel from '@/components/booth/FilterPanel';
import StickerPanel from '@/components/booth/StickerPanel';
import LayoutSelector from '@/components/booth/LayoutSelector';
import PhotoStrip from '@/components/booth/PhotoStrip';

const BoothPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background grain-overlay">
      <nav className="flex items-center gap-4 px-6 md:px-12 py-5 border-b border-border">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-typewriter text-sm hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="font-display text-xl font-bold italic">✦ velvetbooth</h1>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <CameraFrame />
            <div className="glass-card p-5 space-y-5">
              <FilterPanel />
              <StickerPanel />
              <LayoutSelector />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <p className="font-typewriter text-xs tracking-widest text-muted-foreground">✦ YOUR STRIP</p>
            <PhotoStrip />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BoothPage;
