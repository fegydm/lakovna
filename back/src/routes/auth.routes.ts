// File: back/src/routes/auth.routes.ts
// Last change: Fixed import errors and path inconsistencies

import { Router, Request, Response } from 'express';
import passport from 'passport';

import { protect } from '../middlewares/auth.middleware';
import { rate_limiter } from '../middlewares/rate-limiter.middleware';
import * as auth_controller from '../controllers/auth.controller';
import { sign_token } from '../auth/auth.utils';
import type { AuthUser } from 'common/types/universal.types';
import { APP_PATHS } from 'common/configs/paths.config';
import { PROJECT_CONFIG } from 'common/configs/project.config';

const auth_router = Router();
const login_limiter = rate_limiter(15 * 60 * 1000, 10);

auth_router.post(APP_PATHS.auth_paths.register_organization, auth_controller.register_and_create_org);
auth_router.post(APP_PATHS.auth_paths.login, login_limiter, auth_controller.login_worker);
auth_router.post(APP_PATHS.auth_paths.login_terminal, login_limiter, auth_controller.login_terminal);

auth_router.get(
  APP_PATHS.auth_paths.google,
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

auth_router.get(
  APP_PATHS.auth_paths.google_callback,
  passport.authenticate('google', { failureRedirect: APP_PATHS.auth_paths.login, session: false }),
  async (req: Request, res: Response) => {
    const user = req.user as AuthUser;
    if (!user) {
      return res.redirect(
        `${PROJECT_CONFIG.branding.frontend_url}/auth/callback?error=user_not_found`
      );
    }

    const token = sign_token({
      id: user.id,
      role: user.access_role,
    });

    res.redirect(`${PROJECT_CONFIG.branding.frontend_url}/auth/callback?token=${token}`);
  }
);

auth_router.post(APP_PATHS.auth_paths.request_password_link, auth_controller.request_password_link);
auth_router.post(APP_PATHS.auth_paths.complete_password_link, auth_controller.complete_password_link);

auth_router.get(APP_PATHS.auth_paths.profile, protect(), auth_controller.get_profile);

export default auth_router;