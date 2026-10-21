import {
  createGoogleOAuthUrl,
  loginWithPassword,
  signOutSession,
  signUpWithPassword,
} from '../services/auth.service.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export const login = async (req, res) => {
  const result = await loginWithPassword(req.body);
  res.status(200).json(result);
};

export const startGoogleOAuth = async (req, res) => {
  const origin = req.get('origin');
  if (!origin || !env.corsOrigins.includes(origin)) {
    throw new AppError('OAuth redirect origin is not allowed', 400, 'INVALID_REDIRECT_ORIGIN');
  }

  const url = await createGoogleOAuthUrl(origin);
  res.status(200).json({ url });
};

export const signUp = async (req, res) => {
  const result = await signUpWithPassword(req.body);
  res.status(201).json(result);
};

export const logout = async (req, res) => {
  await signOutSession(req.accessToken);
  res.status(200).json({ success: true });
};

export const getMe = (req, res) => {
  res.status(200).json({
    user: {
      id: req.user.id,
      email: req.user.email,
    },
  });
};