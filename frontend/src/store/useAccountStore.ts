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


// this used in add record selecting payment method
type PaymentMethodType = {
  modeOfPayment: string | null,
  setPaymentMethod: (modeOfPayment: string) => void
}
export const usePaymentMethod = create<PaymentMethodType>((set) => ({
  modeOfPayment: null,
  setPaymentMethod: (modeOfPayment)=> set({modeOfPayment}),
}))

type amountHiddenType = {
  isAmountHidden: boolean,
  setIsAmountHidden: (isAmountHidden: boolean) => void
}
export const useAmountHidden = create<amountHiddenType>((set)=>({
  isAmountHidden: localStorage.isAmountHidden === 'true',
  setIsAmountHidden: (isAmountHidden)=> set({isAmountHidden}),
}))