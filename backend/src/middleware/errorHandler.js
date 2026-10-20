import { AppError } from '../utils/AppError.js';

export const errorHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const error =
    err?.type === 'entity.parse.failed'
      ? new AppError('Invalid JSON', 400, 'INVALID_JSON')
      : err;

  if (!(error instanceof AppError)) {
    console.error(error);
    return res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' },
    });
  }

  const response = {
    error: {
      code: error.code,
      message: error.message,
    },
  };

  if (error.details !== undefined) {
    response.error.details = error.details;
  }

  return res.status(error.statusCode).json(response);
};
