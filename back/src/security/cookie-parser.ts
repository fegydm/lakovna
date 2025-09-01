// File: back/src/utils/cookie-parser.ts
// Last change: Removed conflicting Express Request declaration to fix type error

import { Request, Response, NextFunction } from 'express';

export const COOKIE_NAMES = {
  SESSION_ID: 'lakovna_session_id',
  LANGUAGE: 'lakovna_lang',
} as const;

function parseCookies(cookieHeader?: string): Record<string, string> {
  if (!cookieHeader) return {};
  
  return cookieHeader
    .split(';')
    .reduce((cookies: Record<string, string>, cookie: string) => {
      const parts = cookie.trim().split('=');
      if (parts.length >= 2) {
        const key = parts[0];
        const value = parts.slice(1).join('=');
        try {
          cookies[key] = decodeURIComponent(value);
        } catch (error) {
          cookies[key] = value; // Fallback for malformed URI
        }
      }
      return cookies;
    }, {});
}

export const customCookieParser = (req: Request, res: Response, next: NextFunction) => {
  req.cookies = parseCookies(req.headers.cookie);
  next();
};

export function setSecureCookie(
  res: Response, 
  name: string, 
  value: string, 
  options: {
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    path?: string;
  } = {}
) {
  const defaultOptions = {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/'
  };

  res.cookie(name, value, { ...defaultOptions, ...options });
}

export function clearCookie(res: Response, name: string) {
  res.clearCookie(name, { path: '/' });
}
