import { AppError } from '../utils/AppError.js';

export const notFound = (_req, _res, next) => {
  next(new AppError('Not found', 404, 'NOT_FOUND'));
};
