// File: back/src/middlewares/auth.middleware.ts
// Last change: Fixed import errors and refactored to be more database-agnostic

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { AccessRole } from 'common/types/access-role.types';
import { MembershipStatus } from 'common/types/auth.types';
import type { AuthUser, JWTPayload } from 'common/types/auth.types';
import { has_permission } from 'common/configs/access-role.config';
import { get_user_with_memberships } from '../utils/user.utils';

export const protect = (allowed_roles: AccessRole[] = []): ((req: Request, res: Response, next: NextFunction) => void) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const auth_header = req.headers.authorization;
    if (!auth_header || !auth_header.startsWith('Bearer ')) {
      return res.status(401).json({ is_success: false, error: 'Unauthorized: No token provided.' });
    }

    const token = auth_header.split(' ')[1];
    let decoded_payload: JWTPayload;

    try {
      decoded_payload = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
    } catch (err) {
      console.error('JWT verification failed:', err);
      return res.status(401).json({ is_success: false, error: 'Unauthorized: Invalid token.' });
    }

    // Abstrahované od Prismi
    const db_user = await get_user_with_memberships(decoded_payload.id, MembershipStatus.ACTIVE);

    if (!db_user) {
      return res.status(401).json({ is_success: false, error: 'Unauthorized: User not found.' });
    }

    if (!db_user.is_active) {
      return res.status(403).json({ is_success: false, error: 'Forbidden: User account disabled.' });
    }

    const primary_membership = db_user.memberships.length > 0 ? db_user.memberships[0] : null;

    const auth_user: AuthUser = {
      id: db_user.id,
      email: db_user.email,
      name: db_user.name,
      is_verified: db_user.is_verified,
      access_role: primary_membership?.access_role as AccessRole ?? AccessRole.VIEWER,
      business_role: primary_membership?.business_role,
      memberships: db_user.memberships.map((m: any) => ({
        organization_id: m.organization_id,
        role: m.access_role as AccessRole,
        business_role: m.business_role,
      })),
    };

    if (allowed_roles.length > 0 && !allowed_roles.includes(auth_user.access_role)) {
      return res.status(403).json({ is_success: false, error: 'Forbidden: Insufficient permissions.' });
    }

    req.user = auth_user;
    next();
  };
};