// File: common/types/back/express.d.ts
// Last change: Corrected the import path for AuthUser.

import type { AuthUser } from '../auth.types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      useragent?: {
        isBot: boolean;
      };
      cookies: Record<string, string>;
    }
  }
}