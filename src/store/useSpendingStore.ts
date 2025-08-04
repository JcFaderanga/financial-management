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


interface excludedState{
    excluded: null | any,
    setItemExclude: (spendings: any | null)=> void,
}
export const useSpendingExcluded = create<excludedState>((set)=>({
    excluded: null,
    setItemExclude: (excluded)=> set({excluded})
}))

interface allSpending{
    allSpentData: null | any,
    setAllSpentData: (spendings: any | null)=> void,
}
export const useAllSpendingData = create<allSpending>((set)=>({
    allSpentData: null,
    setAllSpentData: (allSpentData)=> set({allSpentData})
}))

