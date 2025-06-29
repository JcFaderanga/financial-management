import { create } from "zustand";

interface dateType {
  date: string | Date;
  setDate: (date: string) => void;
}

export const useOverviewDateStore = create<dateType>((set) => ({
  date: new Date(), //default
  setDate: (date) => set({ date }),
}));
