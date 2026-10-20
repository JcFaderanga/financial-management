import { createSupabaseClient } from '../config/supabase.js';
import { AppError } from '../utils/AppError.js';

export const loginWithPassword = async ({ email, password }) => {
  const { data, error } = await createSupabaseClient().auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (
      error.code === 'invalid_credentials' ||
      error.message === 'Invalid login credentials'
    ) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    if (error.code === 'email_not_confirmed') {
      throw new AppError('Email not confirmed', 403, 'EMAIL_NOT_CONFIRMED');
    }

    if (error.status === 429) {
      throw new AppError('Too many login attempts', 429, 'RATE_LIMITED');
    }

    console.error('Supabase login failed:', error);
    throw new AppError('Authentication service unavailable', 502, 'AUTH_UNAVAILABLE');
  }

  const { user, session } = data;

  return {
    user: { id: user.id, email: user.email },
    session: {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_in: session.expires_in,
      expires_at: session.expires_at,
      token_type: session.token_type,
    },
  };
};