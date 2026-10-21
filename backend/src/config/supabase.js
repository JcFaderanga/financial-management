import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';


export const supabase = createClient(env.supabaseUrl, env.supabaseKey);

export const createSupabaseClient = (accessToken) =>
  createClient(env.supabaseUrl, env.supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });


