import { create } from "zustand";

type userState = {
  time?: number;
  duration?: number;
  toastList: any[]; // or a specific type like `Toast[]`
  setToastDuration: (duration: number) => void;
  setToastList: (val: any) => void;
};

export const useToastStore = create<userState>((set) => ({
  time: 100,
  duration: 0,
  toastList: [],
  setToastDuration: (duration) => set({ duration }),
  setToastList: (val) => set({ toastList: val }),
}));
