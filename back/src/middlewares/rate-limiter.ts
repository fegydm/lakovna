// File: back/src/middleware/rate-limiter.ts
// Last change: Created a custom in-memory rate limiter

import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  firstRequest: number;
}

const requests = new Map<string, RateLimitRecord>();

export const rateLimiter = (windowMs: number, maxRequests: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || '127.0.0.1';
    const now = Date.now();
    const record = requests.get(ip);

    if (!record || now - record.firstRequest > windowMs) {
      // If no record or the window has expired, create a new one
      requests.set(ip, { count: 1, firstRequest: now });
      return next();
    }

    if (record.count < maxRequests) {
      // Increment the count if within the limit
      record.count++;
      requests.set(ip, record);
      return next();
    }

    // If the limit is exceeded, send a 429 Too Many Requests response
    res.status(429).json({
      message: 'Too many requests from this IP, please try again later.',
    });
  };
};
