import { createSupabaseClient } from '../config/supabase.js';
import { AppError } from '../utils/AppError.js';

export const requireAuth = async (req, _res, next) => {
  const authorization = req.get('authorization');
  const match = authorization?.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
  }

  const accessToken = match[1];
  const { data, error } = await createSupabaseClient().auth.getUser(accessToken);

  if (error || !data.user) {
    throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
  }

  req.user = data.user;
  req.accessToken = accessToken;
  return next();
};
