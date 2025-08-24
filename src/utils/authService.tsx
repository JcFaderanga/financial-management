// src/utils/session.ts
import supabase from "@/lib/supabase";
import { useSession } from "@/store/useSession";

export const getAndStoreSession = async () => {
  const { setSession } = useSession.getState(); 
  const { data: { session } } = await supabase.auth.getSession();
  setSession(session);
  return session;
};

export const subscribeToAuthChanges = () => {
  const { setSession } = useSession.getState();

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
  });

  return () => subscription.unsubscribe();
};

export const signInWithGoogle = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin, // important for local vs prod
    },
});
  if (error) {
    console.error('Error during Google sign-in:', error.message);
  }
  } catch (error: any) {
    console.log(error.message)
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error.message)
    }
  } catch (error: any) {
    console.log('catch', error.message)
  }
}

export const signInDemo = async (): Promise<void>=>{

   try {
    const {error} =await supabase.auth.signInWithPassword({
            email: "demo@example.com",
            password: "demo123",
    })

    if(error) throw new Error(error.message);

    window.location.href = "/"; 
  } catch (error: any) {
    console.error('catch', error.message)
  }
    
}
