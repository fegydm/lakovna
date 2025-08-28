// File: common/types/auth-user.types.ts
// Last change: Split AuthUser (full) from JWTPayload (minimal token payload)

import { AccessRole } from './access-role.types';

export interface MembershipInfo {
  organizationId: string;
  role: AccessRole;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: AccessRole;
  isActive: boolean;
  memberships: MembershipInfo[];
}

export interface JWTPayload {
  id: string;
  role: AccessRole;
  organizationIds: string[];
}
