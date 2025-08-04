import { create } from "zustand";

interface ModalProp {
  children: React.ReactNode | null;
  isModal: boolean;
  setModal: (toggled: boolean) => void;
  setChild: (toggled: any) => any;
}

export const useModal = create<ModalProp>((set) => ({
  children: null,
  isModal: false,
  setModal: (toggled) => set({ isModal: toggled }),
  setChild: (children) => set({ children }),
}));
