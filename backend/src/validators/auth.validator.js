import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Email is invalid'),
  // Only check presence at login. Strength rules belong on sign-up.
  password: z.string().min(1, 'Password is required').max(128, 'Password is too long'),
});