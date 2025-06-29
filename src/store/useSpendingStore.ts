import { create } from "zustand";

interface addItemState{
    spendings: null | any,
    setSpendItems: (spendings: any | null)=> void,
}
export const useSpendings = create<addItemState>((set)=>({
    spendings: null,
    setSpendItems: (spendings)=> set({spendings})
}))