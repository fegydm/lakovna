// File: back/src/configs/passport.config.ts
// Last change: Integrated mapRole utility to normalize AccessRole

import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { prisma } from '../lib/prisma.js';
import { mapRole } from '../utils/auth.utils.js';

const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      },
      async (accessToken, refreshToken, profile: Profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('Google profile missing email.'), false);
          }

          const worker = await prisma.worker.findUnique({ where: { email } });

          if (!worker) {
            return done(null, false, { message: 'No worker associated with this Google account.' });
          }

          if (!worker.isActive) {
            return done(null, false, { message: 'This account is disabled.' });
          }

          return done(null, {
            ...worker,
            role: mapRole(worker.role),
          });
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );

  console.log('🚀 [AUTH] Passport configured solely for Google OAuth.');
};

export default configurePassport;
