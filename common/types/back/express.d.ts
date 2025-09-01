// File: common/types/back/express.d.ts
// Last change: Replaced Prisma Worker with lightweight AuthUser type (backend-only)

import type { AuthUser } from '../auth.types';

declare global {
  namespace Express {
    export interface User extends AuthUser {}
    export interface Request {
      user?: AuthUser;
    }
  }
}
