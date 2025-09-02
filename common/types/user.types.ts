// File: common/types/user.types.ts
// Last change: Added shared user types for AuthUser and services

import { AccessRole } from './access-role.types';
import { MembershipStatus } from './auth.types';

export interface UserMembership {
  organization_id: string;
  role: AccessRole;
  business_role: string | null;
  status: MembershipStatus;
}

export interface UserWithMemberships {
  id: string;
  name: string;
  email: string;
  password?: string | null;
  is_verified: boolean;
  is_active: boolean;
  memberships: UserMembership[];
}
