// File: back/src/middleware/error.middleware.ts
// Last change: Extracted the final error handling logic from the main server file

import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[ERROR HANDLER]', err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};
