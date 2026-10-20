// src/store/useCategoryColors.ts
import { create } from 'zustand';

type CategoryColor = {
  category: string;
  color: string;
};

type CategoryColorsStore = {
  colors: CategoryColor[];
  setColor: (category: string, color: string) => void;
  getColor: (category: string) => string | undefined;
};

export const useCategoryColors = create<CategoryColorsStore>((set, get) => ({
  colors: [],
  setColor: (category, color) => {
    const existing = get().colors.find(c => c.category === category);
    if (!existing) {
      set((state) => ({
        colors: [...state.colors, { category, color }],
      }));
    }
  },
  getColor: (category) => {
    return get().colors.find(c => c.category === category)?.color;
  },
}));
