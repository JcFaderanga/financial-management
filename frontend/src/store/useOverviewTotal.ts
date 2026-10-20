import { create } from "zustand";

type props = {
  total: number | string,
  setTotal: (total: string | number) => void
}

export const useOverviewTotal = create<props>((set) => ({
  total: '',
  setTotal: (total)=> set({total}),
}))
