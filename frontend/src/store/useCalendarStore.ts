import { create } from "zustand";
type props = {
  currentMonth: Date,
  setCurrentMonth: (currentMonth: any) => void
}

export const useThisMonth = create<props>((set) => ({
  currentMonth: new Date(),
  setCurrentMonth: (currentMonth)=> set({currentMonth}),
}))
