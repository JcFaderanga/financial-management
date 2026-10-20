import { create } from "zustand";

interface addItemState{
    transactions: null | any,
    setSpendingTransactionList: (transaction: any | null)=> void,
}

//use to select item or range of item
export const useSpendingList = create<addItemState>((set)=>({
    transactions: null,
    setSpendingTransactionList: (transactions)=> set({transactions})
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


interface loadingProps{
    isLoading: null | any,
    setLoading: (isLoading: any | null)=> void,
}
export const useFetchLoader = create<loadingProps>((set)=>({
    isLoading: false,
    setLoading: (isLoading)=> set({isLoading})
}))
