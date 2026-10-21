import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  getMe,
  login,
  logout,
  signUp,
  startGoogleOAuth,
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, signUpSchema } from '../validators/auth.validators.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, res) =>
    res.status(429).json({
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many login attempts',
      },
    }),
});

router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/oauth/google', loginLimiter, startGoogleOAuth);
router.post('/signup', validate(signUpSchema), signUp);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getMe);

export default router;