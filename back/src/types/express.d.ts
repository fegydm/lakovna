// File: back/src/types/express.d.ts
// Last change: Created custom type declaration to resolve Passport/Express conflicts

import { Worker } from '@/prisma/generated/client/index.js';

// This declaration merging tells TypeScript that inside our Express app,
// the `user` property on the Request object is of our `Worker` type from Prisma.
// This resolves conflicts between @types/express and @types/passport.
declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface User extends Worker {}
  }
}
