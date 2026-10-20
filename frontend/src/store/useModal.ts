import { create } from "zustand";

interface ModalBase {
  children: React.ReactNode | null;
}

interface ModalState extends ModalBase {
  isModal: boolean;
  setModal: (toggled: boolean) => void;
  setChild: (children: React.ReactNode | null) => void;
}

interface ModalFullState extends ModalBase {
  isModalFS: boolean;
  setModalFS: (toggled: boolean) => void;
  setChildFS: (children: React.ReactNode | null) => void;
}

export const useModal = create<ModalState>((set) => ({
  children: null,
  isModal: false,
  setModal: (toggled) => set({ isModal: toggled }),
  setChild: (children) => set({ children }),
}));

export const useModalFull = create<ModalFullState>((set) => ({
  children: null,
  isModalFS: false,
  setModalFS: (toggled) => set({ isModalFS: toggled }),
  setChildFS: (children) => set({ children }),
}));
