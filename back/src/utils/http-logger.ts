// File: back/src/utils/http-logger.ts
// Last change: Added express types and fixed typo

import { Request, Response, NextFunction } from 'express';

export function httpLogger(req: Request, res: Response, next: NextFunction): void {
  const isBotIcon = req.useragent?.isBot ? "🤖" : "👤";
  const ip = req.ip || req.socket?.remoteAddress || 'unknown ip';
  
  console.log(`[HTTP] ${ip} | ${req.method} ${req.originalUrl} | ${isBotIcon}`);
  
  next();
}
