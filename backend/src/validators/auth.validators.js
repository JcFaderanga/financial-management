import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Email is invalid'),
  password: z.string().min(1, 'Password is required').max(128, 'Password is too long'),
});

export const signUpSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Email is invalid'),
  password: z.string().min(1, 'Password is required').max(128, 'Password is too long'),
});
