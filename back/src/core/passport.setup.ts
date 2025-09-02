// File: back/src/core/passport.setup.ts
// Last change: Fixed type incompatibility by consistently using common AccessRole type

import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';

import { prisma } from './prisma.client';
import { AccessRole } from 'common/types/access-role.types';
import type { AuthUser, AuthMembership } from 'common/types/auth.types';

export const configure_passport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      },
      async (_access_token, _refresh_token, profile: Profile, done) => {
        try {
          const user_email = profile.emails?.[0]?.value;
          if (!user_email) {
            return done(new Error('Google profile missing email.'), false);
          }

          const db_user = await prisma.user.findUnique({
            where: { email: user_email },
            include: {
              memberships: {
                select: {
                  organization_id: true,
                  access_role: true,
                  business_role: true,
                },
              },
            },
          });

          if (!db_user) {
            return done(null, false, { message: 'No user associated with this Google account.' });
          }

          if (!db_user.is_active) {
            return done(null, false, { message: 'This account is disabled.' });
          }

          const primary_membership = db_user.memberships.length > 0 ? db_user.memberships[0] : null;

          const user: AuthUser = {
            id: db_user.id,
            name: db_user.name,
            email: db_user.email,
            is_verified: db_user.is_verified,
            access_role: primary_membership?.access_role as AccessRole ?? AccessRole.VIEWER,
            business_role: primary_membership?.business_role,
            memberships: db_user.memberships.map((m) => ({
                organization_id: m.organization_id,
                role: m.access_role as AccessRole,
                business_role: m.business_role,
            })),
          };

          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const db_user = await prisma.user.findUnique({
        where: { id },
        include: {
          memberships: {
            select: {
              organization_id: true,
              access_role: true,
              business_role: true,
            },
          },
        },
      });

      if (!db_user || !db_user.is_active) {
        return done(null, false);
      }

      const primary_membership = db_user.memberships.length > 0 ? db_user.memberships[0] : null;

      const user: AuthUser = {
        id: db_user.id,
        name: db_user.name,
        email: db_user.email,
        is_verified: db_user.is_verified,
        access_role: primary_membership?.access_role as AccessRole ?? AccessRole.VIEWER,
        business_role: primary_membership?.business_role,
        memberships: db_user.memberships.map((m) => ({
          organization_id: m.organization_id,
          role: m.access_role as AccessRole,
          business_role: m.business_role,
        })),
      };

      return done(null, user);
    } catch (error) {
      return done(error as Error);
    }
  });
};

export default configure_passport;