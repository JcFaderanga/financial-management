import { create } from "zustand";
import { datePropertyTypes } from "@/types/itemTypes";

interface dateType {
  date: string |datePropertyTypes;
  setDate: (date: string | datePropertyTypes) => void;
}

export const useOverviewDateStore = create<dateType>((set) => ({
  date: {
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
  }, //default
  setDate: (date) => set({ date }),
}));
