import { create } from "zustand";

interface MenuState {
  isMenuActive: boolean;
  setMenuIsActive: (toggled: boolean) => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  isMenuActive: false,
  setMenuIsActive: (toggled) => set({ isMenuActive: toggled }),
}));
