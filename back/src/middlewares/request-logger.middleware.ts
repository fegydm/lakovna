// File: back/src/middlewares/request-logger.middleware.ts
// Last change: Finalized lightweight HTTP logger with response time

import { Request, Response, NextFunction } from 'express';

export function http_logger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const is_bot = req.useragent?.isBot || false;
  const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    console.log(
      `${ip} ${req.method} ${req.url} ${status} - ${duration}ms ${is_bot ? '🤖' : '👤'}`
    );
  });

  next();
}
