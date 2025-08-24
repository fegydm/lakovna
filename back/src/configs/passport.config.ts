// File: back/src/configs/passport.config.ts
// Last change: Simplified to only contain the Google OAuth2 strategy

import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { prisma } from '../lib/prisma.js';
import { WorkerRole } from '@prisma/client';

const configurePassport = () => {
  // We only configure the Google Strategy, as all other auth is handled by custom middleware.
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
          
          if (worker.role !== WorkerRole.ADMIN && worker.role !== WorkerRole.MANAGER) {
            return done(null, false, { message: 'Only managers and admins can log in with Google.' });
          }

          return done(null, worker);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );

  console.log('🚀 [AUTH] Passport configured solely for Google OAuth.');
};

export default configurePassport;
