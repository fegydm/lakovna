// File: common/configs/access-role.config.ts
// AccessRole runtime config – hierarchy, defaults, utilities

import { AccessRole } from '../types/access-role.types';

// Role hierarchy for permission comparison
export const ACCESS_ROLE_ORDER: Record<AccessRole, number> = {
  superadmin: 8,
  developer: 7,
  owner: 6,
  manager: 5,
  coordinator: 4,
  worker: 3,
  partner: 2,
  viewer: 1,
} as const;

// Permission utilities
export const hasPermission = (userRole: AccessRole, requiredRole: AccessRole): boolean =>
  ACCESS_ROLE_ORDER[userRole] >= ACCESS_ROLE_ORDER[requiredRole];

export const canManageRole = (managerRole: AccessRole, targetRole: AccessRole): boolean =>
  ACCESS_ROLE_ORDER[managerRole] > ACCESS_ROLE_ORDER[targetRole];

// Conversion helpers for Prisma enum (AccessRole is identical to DB enum)
export const roleToDbFormat = (role: AccessRole): string => role;

export const roleFromDbFormat = (dbRole: string): AccessRole => {
  if (!Object.values(AccessRole).includes(dbRole as AccessRole)) {
    throw new Error(`Invalid AccessRole value from DB: ${dbRole}`);
  }
  return dbRole as AccessRole;
};

// Safe fallback variant (no throw)
export const safeRoleFromDbFormat = (dbRole: string): AccessRole =>
  (Object.values(AccessRole).includes(dbRole as AccessRole) ? (dbRole as AccessRole) : AccessRole.viewer);

// Type guard for runtime checks
export const isAccessRole = (value: unknown): value is AccessRole =>
  typeof value === 'string' && Object.values(AccessRole).includes(value as AccessRole);

// Default role for new users
export const DEFAULT_ACCESS_ROLE: AccessRole = AccessRole.viewer;
