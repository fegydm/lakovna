// File: back/src/middlewares/cors.middleware.ts
// Last change: Corrected to use alias and reference the new CORS configuration path

import { Request, Response, NextFunction } from 'express';
import { PROJECT_CONFIG } from 'common/configs/project.config';

export const custom_cors_middleware = (req: Request, res: Response, next: NextFunction) => {
  const allowed_origins = PROJECT_CONFIG.routing.cors.allowed_origins;
  const origin = req.headers.origin;

  if (typeof origin === 'string' && allowed_origins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', PROJECT_CONFIG.routing.cors.allowed_methods.join(', '));
  res.setHeader('Access-Control-Allow-Headers', PROJECT_CONFIG.routing.cors.allowed_headers.join(', '));
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Expose-Headers', PROJECT_CONFIG.routing.cors.exposed_headers.join(', '));

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
};