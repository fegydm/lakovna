// File: back/src/middlewares/rate-limiter.middleware.ts
// Last change: Finalized lightweight in-memory rate limiter

import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  first_request: number;
}

const requests = new Map<string, RateLimitRecord>();

export const rate_limiter = (window_ms: number, max_requests: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();
    const record = requests.get(ip);

    if (!record || now - record.first_request > window_ms) {
      requests.set(ip, { count: 1, first_request: now });
      return next();
    }

    if (record.count < max_requests) {
      record.count++;
      requests.set(ip, record);
      return next();
    }

    const retry_after = Math.ceil((window_ms - (now - record.first_request)) / 1000);

    res.setHeader('Retry-After', retry_after.toString());
    res.status(429).json({
      is_success: false,
      error: 'Too many requests from this IP, please try again later.',
    });
  };
};
