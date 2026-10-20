import { create } from "zustand";

type userState = {
  user: any,
  setUser: (user: any) => void
}

export const useUserStore = create<userState>((set) => ({
  user: null,
  setUser: (user)=> set({user}),
}))
