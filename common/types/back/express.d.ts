// File: common/types/back/express.d.ts
// Last change: Consolidated Express Request interface extensions, including useragent

import type { AuthUser } from '../auth.types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      useragent?: {
        isBot: boolean;
      };
    }
  }
}