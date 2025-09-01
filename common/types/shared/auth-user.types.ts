// File: common/types/shared/auth-user.types.ts

import type { AccessRole } from '../universal/access-role.types';
import type { ProjectOrgType } from '../project/org-type.types';

export interface AuthUser {
  id: number | string;
  name: string;
  email: string;
  role: AccessRole;
  imageUrl?: string;
  selectedRole?: ProjectOrgType;
  emailVerified?: boolean;
  isAdmin?: boolean;
  isActive: boolean; // ✅ added so middleware compiles
  memberships: {
    organizationId: string;
    role: AccessRole;
  }[];
}
