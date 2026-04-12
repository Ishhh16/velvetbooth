import { motion } from 'framer-motion';
import { useBoothStore, type LayoutType } from '@/store/boothStore';

const layouts: { value: LayoutType; label: string; icon: React.ReactNode }[] = [
  { value: 'single', label: '1', icon: <div className="w-6 h-8 border border-current rounded-[2px]" /> },
  {
    value: 'vertical-2',
    label: '2',
    icon: (
      <div className="flex flex-col gap-0.5">
        <div className="w-6 h-3.5 border border-current rounded-[2px]" />
        <div className="w-6 h-3.5 border border-current rounded-[2px]" />
      </div>
    ),
  },
  {
    value: 'strip-3',
    label: '3',
    icon: (
      <div className="flex flex-col gap-0.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-6 h-2.5 border border-current rounded-[2px]" />
        ))}
      </div>
    ),
  },
  {
    value: 'grid-4',
    label: '4',
    icon: (
      <div className="grid grid-cols-2 gap-0.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="w-3 h-3 border border-current rounded-[2px]" />
        ))}
      </div>
    ),
  },
];

const LayoutSelector = () => {
  const { selectedLayout, setLayout } = useBoothStore();

  return (
    <div>
      <p className="font-typewriter text-xs tracking-widest text-muted-foreground mb-3">✦ LAYOUT</p>
      <div className="flex gap-2">
        {layouts.map((l) => (
          <motion.button
            key={l.value}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setLayout(l.value)}
            className={`w-14 h-14 rounded-sm border flex items-center justify-center transition-colors ${
              selectedLayout === l.value
                ? 'bg-foreground text-primary-foreground border-foreground'
                : 'border-border hover:border-foreground'
            }`}
          >
            {l.icon}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default LayoutSelector;
