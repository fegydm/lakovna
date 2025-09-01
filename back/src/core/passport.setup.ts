// File: back/src/core/passport.setup.ts
// Last change: Use roleFromDbFormat from common/configs/access-role.config

import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { prisma } from './prisma.client';
import { roleFromDbFormat } from 'common/configs/access-role.config';

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
            role: roleFromDbFormat(worker.role),
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
