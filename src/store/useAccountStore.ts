import { create } from "zustand";
import { AccountType } from "@/types/AccountTypes";

type accountType = {
  account: AccountType[] | [],
  setAccount: (account: AccountType[]) => void
}

export const useAccountStore = create<accountType>((set) => ({
  account: [],
  setAccount: (account)=> set({account}),
}))
