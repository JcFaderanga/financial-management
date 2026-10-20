import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

const createClientOptions = () => ({
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

export const createSupabaseClient = () =>
  createClient(env.supabaseUrl, env.supabaseKey, createClientOptions());

export const createUserSupabaseClient = (accessToken) =>
  createClient(env.supabaseUrl, env.supabaseKey, {
    ...createClientOptions(),
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
