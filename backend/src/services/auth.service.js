import { createClient } from '@supabase/supabase-js';
import { supabase } from '../config/supabase.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export const createGoogleOAuthUrl = async (redirectTo) => {
  const oauthClient = createClient(env.supabaseUrl, env.supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
      flowType: 'implicit',
    },
  });
  const { data, error } = await oauthClient.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: true },
  });

  if (error || !data.url) {
    if (error) {
      console.error('Supabase Google OAuth initialization failed:', error);
    }
    throw new AppError('Unable to start Google sign-in', 502, 'OAUTH_UNAVAILABLE');
  }

  return data.url;
};

const mapAuthSession = ({ user, session }) => ({
  user: { id: user.id, email: user.email },
  session: session
    ? {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_in: session.expires_in,
        expires_at: session.expires_at,
        token_type: session.token_type,
      }
    : null,
});

export const loginWithPassword = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
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

  return mapAuthSession(data);
};

export const signUpWithPassword = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    if (error.status === 429) {
      throw new AppError('Too many sign-up attempts', 429, 'RATE_LIMITED');
    }

    if (error.status >= 400 && error.status < 500) {
      throw new AppError(error.message, error.status, 'SIGNUP_FAILED');
    }

    console.error('Supabase sign-up failed:', error);
    throw new AppError('Authentication service unavailable', 502, 'AUTH_UNAVAILABLE');
  }

  return mapAuthSession(data);
};

export const signOutSession = async (accessToken) => {
  const response = await fetch(`${env.supabaseUrl}/auth/v1/logout?scope=global`, {
    method: 'POST',
    headers: {
      apikey: env.supabaseKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.error('Supabase logout failed with status:', response.status);
    throw new AppError('Unable to sign out', 502, 'LOGOUT_FAILED');
  }
};