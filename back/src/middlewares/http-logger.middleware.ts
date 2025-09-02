// File: back/src/middlewares/http-logger.middleware.ts
// Last change: Refactored to use snake_case naming and explicit types

import { Request, Response, NextFunction } from 'express';

export function http_logger(req: Request, res: Response, next: NextFunction) {
  const is_bot = req.useragent?.isBot || false;
  const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
  
  console.log(`${ip} ${req.method} ${req.url} ${is_bot ? '🤖' : '👤'}`);
  
  next();
}