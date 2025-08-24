// File: back/src/middleware/cors.middleware.ts
// Last change: Extracted custom CORS logic into a dedicated middleware file

import { Request, Response, NextFunction } from 'express';

export const customCorsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "https://autolakovna.online"
  ];
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  
  next();
};
