// File: common/types/user.types.ts
// Last change: Consolidated user types and aligned with a single source of truth.

import type { AuthMembership } from './auth backup.types';

// This interface is the main user type for application logic
export interface UserWithMemberships {
  id: string;
  name: string;
  email: string;
  password?: string | null;
  isVerified: boolean;
  isActive: boolean;
  memberships: AuthMembership[];
}