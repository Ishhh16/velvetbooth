import { motion } from 'framer-motion';
import { useBoothStore, type FilterType } from '@/store/boothStore';

const filters: { value: FilterType; label: string; preview: string }[] = [
  { value: 'none', label: 'Original', preview: '' },
  { value: 'vintage', label: 'Vintage', preview: 'sepia(0.4) saturate(1.3)' },
  { value: 'bw', label: 'B&W', preview: 'grayscale(1)' },
  { value: 'sepia', label: 'Sepia', preview: 'sepia(0.8)' },
  { value: 'vhs', label: 'VHS', preview: 'saturate(1.5) hue-rotate(5deg)' },
];

const FilterPanel = () => {
  const { activeFilter, setFilter } = useBoothStore();

  return (
    <div>
      <p className="font-typewriter text-xs tracking-widest text-muted-foreground mb-3">✦ FILTERS</p>
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <motion.button
            key={f.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-sm font-typewriter text-xs border transition-colors ${
              activeFilter === f.value
                ? 'bg-foreground text-primary-foreground border-foreground'
                : 'border-border hover:border-foreground'
            }`}
          >
            {f.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;
