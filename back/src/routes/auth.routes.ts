// File: back/src/routes/auth.routes.ts
// Last change: Fixed req.user typing to AuthUser instead of Prisma.Worker

import { Router, Request, Response } from 'express';
import passport from 'passport';
import { protect } from '../middlewares/auth.middleware';
import { rateLimiter } from '../middlewares/rate-limiter';
import * as authController from '../controllers/auth.controller';
import * as workerController from '../controllers/worker.controller';
import { signToken } from '../auth/auth.utils';
import type { AuthUser } from 'common/types/auth.types';

const authRouter = Router();
const loginLimiter = rateLimiter(15 * 60 * 1000, 10);

authRouter.post('/register-organization', authController.registerAndCreateOrg);
authRouter.post('/login', loginLimiter, authController.loginWorker);
authRouter.post('/login/terminal', loginLimiter, authController.loginTerminal);

authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  async (req: Request, res: Response) => {
    // ✅ správne typovanie
    const user = req.user as AuthUser;
    if (!user) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/callback?error=worker_not_found`
      );
    }

    const token = signToken({
      id: user.id,
      role: user.role,
    });

    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

authRouter.post('/link-password/request', workerController.requestPasswordLink);
authRouter.post('/link-password/complete', workerController.completePasswordLink);

authRouter.get('/profile', protect(), authController.getProfile);

export default authRouter;
