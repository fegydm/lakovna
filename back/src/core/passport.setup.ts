// File: back/src/core/passport.setup.ts
// COMPLETE CORRECTED CODE

import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';

import { prisma } from './prisma.client';
import { ACCESS_ROLES } from 'common/configs/enums.config';
import { PROJECT_CONFIG } from 'common/configs/project.config'; 
import type { AccessRole, AuthUser, AuthMembership, BusinessRole } from 'common/types/project.types';

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      },
      async (_accessToken, _refreshToken, profile: Profile, done) => {
        try {
          const userEmail = profile.emails?.[0]?.value;
          if (!userEmail) {
            return done(new Error('Google profile missing email.'), false);
          }

          const dbUser = await prisma.user.findUnique({
            where: { email: userEmail },
            include: {
              memberships: {
                select: {
                  organization_id: true,
                  access_role: true,
                  business_role: true,
                  status: true,
                },
              },
            },
          });

          if (!dbUser) {
            return done(null, false, { message: 'No user associated with this Google account.' });
          }

          if (!dbUser.is_active) {
            return done(null, false, { message: 'This account is disabled.' });
          }

          const primaryMembership = dbUser.memberships.length > 0 ? dbUser.memberships[0] : null;
          const dbBusinessRole = primaryMembership?.business_role;

          const user: AuthUser = {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            isVerified: dbUser.is_verified,
            accessRole: primaryMembership?.access_role as AccessRole ?? ACCESS_ROLES.VIEWER,
            // FIX 2: Validate the business role from the database
            businessRole: dbBusinessRole && (PROJECT_CONFIG.businessRoles as readonly string[]).includes(dbBusinessRole)
              ? dbBusinessRole as BusinessRole
              : null,
            memberships: dbUser.memberships.map((m): AuthMembership => {
                const currentDbRole = m.business_role;
                return {
                    organizationId: m.organization_id,
                    role: m.access_role as AccessRole,
                    businessRole: currentDbRole && (PROJECT_CONFIG.businessRoles as readonly string[]).includes(currentDbRole)
                        ? currentDbRole as BusinessRole
                        : null,
                    status: m.status as AuthMembership['status']
                }
            }),
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
      const dbUser = await prisma.user.findUnique({
        where: { id },
        include: {
          memberships: {
            select: {
              organization_id: true,
              access_role: true,
              business_role: true,
              status: true,
            },
          },
        },
      });

      if (!dbUser || !dbUser.is_active) {
        return done(null, false);
      }

      const primaryMembership = dbUser.memberships.length > 0 ? dbUser.memberships[0] : null;
      const dbBusinessRole = primaryMembership?.business_role;

      const user: AuthUser = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        isVerified: dbUser.is_verified,
        accessRole: primaryMembership?.access_role as AccessRole ?? ACCESS_ROLES.VIEWER,
        // FIX 3: Validate the business role here as well
        businessRole: dbBusinessRole && (PROJECT_CONFIG.businessRoles as readonly string[]).includes(dbBusinessRole)
            ? dbBusinessRole as BusinessRole
            : null,
        memberships: dbUser.memberships.map((m): AuthMembership => {
            const currentDbRole = m.business_role;
            return {
                organizationId: m.organization_id,
                role: m.access_role as AccessRole,
                businessRole: currentDbRole && (PROJECT_CONFIG.businessRoles as readonly string[]).includes(currentDbRole)
                    ? currentDbRole as BusinessRole
                    : null,
                status: m.status as AuthMembership['status']
            }
        }),
      };

      return done(null, user);
    } catch (error) {
      return done(error as Error);
    }
  });
};

export default configurePassport;