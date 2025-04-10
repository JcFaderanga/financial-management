import { create } from "zustand";

interface sessionState{
    session: {} | null,
    setSession: (session: any | null)=> void,
}
export const useSession = create<sessionState>((set)=>({
    session: null,
    setSession: (session)=> set({session})
}))