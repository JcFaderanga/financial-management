import { create } from "zustand";
import { datePropertyTypes } from "@/types/itemTypes";
import {format} from 'date-fns'
interface dateType {
  date: string |datePropertyTypes;
  setDate: (date: string | datePropertyTypes) => void;
}

export const useOverviewDateStore = create<dateType>((set) => ({
  date: {
    startDate: format(new Date(),"yyyy-MM-dd"),
    endDate: '',
    startTime: '',
    endTime: '',
  }, //default
  setDate: (date) => set({ date }),
}));
