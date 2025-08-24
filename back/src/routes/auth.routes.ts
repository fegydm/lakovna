// File: back/src/routes/auth.routes.ts
// Last change: Fixed imports to use unified prisma client

import { Router, Request, Response } from 'express';
import passport from 'passport';
import { protect } from '../middlewares/auth.middleware.js';
import { rateLimiter } from '../middlewares/rate-limiter.js';
import * as authController from '../controllers/auth.controller.js';
import * as workerController from '../controllers/worker.controller.js';
import { signToken } from '../utils/auth.utils.js';
import { Worker } from '@prisma/client';

const authRouter = Router();
const loginLimiter = rateLimiter(15 * 60 * 1000, 10);

authRouter.post('/register-organization', authController.registerAndCreateOrg);
authRouter.post('/login', loginLimiter, authController.loginWorker);
authRouter.post('/login/terminal', loginLimiter, authController.loginTerminal);

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
authRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req: Request, res: Response) => {
    const token = signToken(req.user as Worker);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

authRouter.post('/link-password/request', workerController.requestPasswordLink);
authRouter.post('/link-password/complete', workerController.completePasswordLink);

authRouter.get('/profile', protect(), authController.getProfile);

export default authRouter;