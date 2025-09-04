// File: back/src/middlewares/cookie-parser.middleware.ts
// Last change: Finalized cookie parser without external dependencies

import { Request, Response, NextFunction } from 'express';

export function parse_cookies(cookie_header?: string): Record<string, string> {
  if (!cookie_header) return {};

  return cookie_header.split(';').reduce((cookies: Record<string, string>, cookie: string) => {
    const [key, ...rest] = cookie.trim().split('=');
    if (!key || rest.length === 0) return cookies;

    const value = rest.join('=');
    cookies[key] = decodeURIComponent(value);
    return cookies;
  }, {});
}

export function cookie_middleware(req: Request, res: Response, next: NextFunction) {
  req.cookies = parse_cookies(req.headers.cookie);
  next();
}
