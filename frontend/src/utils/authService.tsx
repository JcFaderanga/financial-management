// src/utils/session.ts
import type { Session } from '@supabase/supabase-js';
import supabase from "@/lib/supabase";
import { useSession } from "@/store/useSession";
import api from "@/lib/api";

export const getAndStoreSession = async () => {
  const { setSession } = useSession.getState(); 
  const { data: { session } } = await supabase.auth.getSession();
  setSession(session);
  return session;
};

export const subscribeToAuthChanges = (callback?: (session: Session | null) => void) => {
  const { setSession } = useSession.getState();

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);

    if (callback) {
      callback(session);
    }
  });

  return () => subscription.unsubscribe();
};


export const signInWithGoogle = async (): Promise<void> => {
  const { data } = await api.post<{ url: string }>('/api/auth/oauth/google');
  if (!data.url) {
    throw new Error('Authentication service did not return a Google sign-in URL.');
  }
  window.location.assign(data.url);
};

export const signInWithCredentials = async (email: string, password: string): Promise<void> => {
  const { data: { session } } = await api.post<{
    session: {
      access_token: string;
      refresh_token: string;
    };
  }>('/api/auth/login', { email, password });
  const { error } = await supabase.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });

  if (error) {
    throw new Error(error.message);
  }
};

export const signUpWithCredentials = async (email: string, password: string): Promise<boolean> => {
  const { data } = await api.post<{
    session: {
      access_token: string;
      refresh_token: string;
    } | null;
  }>('/api/auth/signup', { email, password });

  if (data.session) {
    const { error } = await supabase.auth.setSession(data.session);
    if (error) {
      throw new Error(error.message);
    }
  }

  return Boolean(data.session);
};

export const signOut = async (): Promise<void> => {
  await api.post('/api/auth/logout');

  const { error } = await supabase.auth.signOut({ scope: 'local' });
  if (error) {
    throw new Error(error.message);
  }
};

export const signInDemo = (): Promise<void> =>
  signInWithCredentials('demo@example.com', 'demo123');
