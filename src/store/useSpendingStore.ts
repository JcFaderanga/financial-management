import { create } from "zustand";

interface addItemState{
    spendings: null | any,
    setSpendItems: (spendings: any | null)=> void,
}
//use to select item or range of item
export const useSpendings = create<addItemState>((set)=>({
    spendings: null,
    setSpendItems: (spendings)=> set({spendings})
}))
