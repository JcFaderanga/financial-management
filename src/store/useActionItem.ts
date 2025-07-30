import { create } from "zustand";
type props = {
  selected: any,
  setSelected: (selected: any) => void
}

export const useActionItem = create<props>((set) => ({
  selected: null,
  setSelected: (selected)=> set({selected}),
}))
