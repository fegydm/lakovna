// File: back/src/middlewares/error.middleware.ts
// Last change: Refactored to use snake_case naming and ensure consistent API response

import { Request, Response, NextFunction } from 'express';

export const error_handler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[ERROR HANDLER]', err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    is_success: false,
    error: err.message || 'Internal Server Error',
  });
};