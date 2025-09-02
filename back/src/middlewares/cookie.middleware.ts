// File: back/src/middlewares/cookie.middleware.ts
// Last change: Refactored to use consistent snake_case naming conventions

import { Request, Response, NextFunction } from 'express';

export function parse_cookies(cookie_header?: string): Record<string, string> {
  if (!cookie_header) return {};
  
  return cookie_header
    .split(';')
    .reduce((cookies: Record<string, string>, cookie: string) => {
      const [key, value] = cookie.trim().split('=');
      if (key && value) {
        cookies[key] = decodeURIComponent(value);
      }
      return cookies;
    }, {});
}

export function cookie_middleware(req: Request, res: Response, next: NextFunction) {
  req.cookies = parse_cookies(req.headers.cookie);
  next();
}