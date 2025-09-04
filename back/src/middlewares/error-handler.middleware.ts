// File: back/src/middlewares/error-handler.middleware.ts
// Last change: Finalized global error handler with statusCode support

import { Request, Response, NextFunction } from 'express';

export const error_handler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[ERROR HANDLER]', err);

  if (res.headersSent) {
    return next(err);
  }

  const status = typeof err.statusCode === 'number' ? err.statusCode : 500;

  res.status(status).json({
    is_success: false,
    error: err.message || 'Internal Server Error',
  });
};
