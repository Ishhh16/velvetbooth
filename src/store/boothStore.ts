import { create } from 'zustand';

export type FilterType = 'none' | 'vintage' | 'bw' | 'sepia' | 'vhs';
export type LayoutType = 'single' | 'vertical-2' | 'strip-3' | 'grid-4';

export interface Sticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  rotation: number;
}

interface BoothState {
  photos: string[];
  selectedLayout: LayoutType;
  activeFilter: FilterType;
  stickers: Sticker[];
  textOverlays: TextOverlay[];
  activePhotoIndex: number;
  isCapturing: boolean;
  countdown: number | null;

  addPhoto: (photo: string) => void;
  removePhoto: (index: number) => void;
  clearPhotos: () => void;
  setLayout: (layout: LayoutType) => void;
  setFilter: (filter: FilterType) => void;
  addSticker: (sticker: Sticker) => void;
  removeSticker: (id: string) => void;
  updateSticker: (id: string, updates: Partial<Sticker>) => void;
  clearStickers: () => void;
  addTextOverlay: (overlay: TextOverlay) => void;
  removeTextOverlay: (id: string) => void;
  updateTextOverlay: (id: string, updates: Partial<TextOverlay>) => void;
  setActivePhoto: (index: number) => void;
  setIsCapturing: (val: boolean) => void;
  setCountdown: (val: number | null) => void;
}

export const useBoothStore = create<BoothState>((set) => ({
  photos: [],
  selectedLayout: 'strip-3',
  activeFilter: 'none',
  stickers: [],
  textOverlays: [],
  activePhotoIndex: 0,
  isCapturing: false,
  countdown: null,

  addPhoto: (photo) => set((s) => ({ photos: [...s.photos, photo] })),
  removePhoto: (index) => set((s) => ({ photos: s.photos.filter((_, i) => i !== index) })),
  clearPhotos: () => set({ photos: [], stickers: [], textOverlays: [] }),
  setLayout: (layout) => set({ selectedLayout: layout }),
  setFilter: (filter) => set({ activeFilter: filter }),
  addSticker: (sticker) => set((s) => ({ stickers: [...s.stickers, sticker] })),
  removeSticker: (id) => set((s) => ({ stickers: s.stickers.filter((st) => st.id !== id) })),
  updateSticker: (id, updates) =>
    set((s) => ({
      stickers: s.stickers.map((st) => (st.id === id ? { ...st, ...updates } : st)),
    })),
  clearStickers: () => set({ stickers: [] }),
  addTextOverlay: (overlay) => set((s) => ({ textOverlays: [...s.textOverlays, overlay] })),
  removeTextOverlay: (id) => set((s) => ({ textOverlays: s.textOverlays.filter((t) => t.id !== id) })),
  updateTextOverlay: (id, updates) =>
    set((s) => ({
      textOverlays: s.textOverlays.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  setActivePhoto: (index) => set({ activePhotoIndex: index }),
  setIsCapturing: (val) => set({ isCapturing: val }),
  setCountdown: (val) => set({ countdown: val }),
}));
