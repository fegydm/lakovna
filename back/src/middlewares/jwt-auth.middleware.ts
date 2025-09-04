// File: back/src/middlewares/jwt-auth.middleware.ts
// Last change: Fixed 'implicit any' error by providing an explicit type.

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { AccessRole } from 'common/types/access-role.types';
import { MembershipStatus, AuthUser, JWTPayload, AuthMembership } from 'common/types/auth backup.types';
import { get_user_by_email } from '../utils/bridge-user.utils';

// Extends the default Request type to include our custom 'user' property.
interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

// Create a more specific type that includes the 'status' property,
// which is returned by the bridge but might not be in the base AuthMembership type.
interface MembershipWithStatus extends AuthMembership {
  status: MembershipStatus;
}

export const protect =
  (allowed_roles: AccessRole[] = []) =>
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const auth_header = req.headers.authorization;
    if (!auth_header?.startsWith('Bearer ')) {
      return res.status(401).json({ is_success: false, error: 'Unauthorized: No token provided.' });
    }

    const token = auth_header.split(' ')[1];
    let decoded_payload: JWTPayload;

    try {
      decoded_payload = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
    } catch (err) {
      console.error('[AUTH] JWT verification failed:', err);
      return res.status(401).json({ is_success: false, error: 'Unauthorized: Invalid token.' });
    }

    const db_user = await get_user_by_email(decoded_payload.id);

    if (!db_user) {
      return res.status(401).json({ is_success: false, error: 'Unauthorized: User not found.' });
    }

    if (!db_user.is_active) {
      return res.status(403).json({ is_success: false, error: 'Forbidden: User account disabled.' });
    }

    // Filter for active memberships.
    // CORRECTED: Explicitly type the parameter 'm' to resolve the 'implicit any' error.
    const active_memberships = db_user.memberships.filter(
      (m: MembershipWithStatus) => m.status === MembershipStatus.Active
    );

    const primary_membership = active_memberships[0] ?? null;

    const auth_user: AuthUser = {
      id: db_user.id,
      email: db_user.email,
      name: db_user.name,
      is_verified: db_user.is_verified,
      access_role: primary_membership?.role ?? AccessRole.Viewer,
      business_role: primary_membership?.business_role,
      // The type of 'm' is now correctly inferred from 'active_memberships'.
      memberships: active_memberships.map((m: { organization_id: any; role: any; business_role: any; }) => ({
        organization_id: m.organization_id,
        role: m.role,
        business_role: m.business_role,
      })),
    };

    if (allowed_roles.length > 0 && !allowed_roles.includes(auth_user.access_role)) {
      return res.status(403).json({ is_success: false, error: 'Forbidden: Insufficient permissions.' });
    }

    req.user = auth_user;
    next();
  };

