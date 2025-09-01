// File: back/src/types/express.d.ts
// Last change: Replaced Prisma Worker with lightweight AuthUser type

import { AuthUser } from 'common/types/universal/auth-status.types';

declare global {
  namespace Express {
    export interface User extends AuthUser {}
    export interface Request {
      user?: AuthUser;
    }
  }
}
