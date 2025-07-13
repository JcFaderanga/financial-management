import { create } from "zustand";

interface ModalProp {
  isModal: boolean;
  setModal: (toggled: boolean) => void;
}

export const useModal = create<ModalProp>((set) => ({
  isModal: false,
  setModal: (toggled) => set({ isModal: toggled }),
}));
