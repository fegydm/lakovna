// File: common/types/universal/access-role.types.ts
// Last change: Unified AccessRole with Prisma schema enum, added utilities for hierarchy and DB mapping

// AccessRole enum is the single source of truth across platform and Prisma schema
export enum AccessRole {
  superadmin = 'superadmin',
  developer = 'developer',
  owner = 'owner',
  manager = 'manager',
  coordinator = 'coordinator',
  worker = 'worker',
  partner = 'partner',
  viewer = 'viewer'
}

// Role hierarchy for permission comparison
export const ACCESS_ROLE_HIERARCHY: Record<AccessRole, number> = {
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
export const hasPermission = (
  userRole: AccessRole,
  requiredRole: AccessRole
): boolean => {
  return ACCESS_ROLE_HIERARCHY[userRole] >= ACCESS_ROLE_HIERARCHY[requiredRole];
};

export const canManageRole = (
  managerRole: AccessRole,
  targetRole: AccessRole
): boolean => {
  return ACCESS_ROLE_HIERARCHY[managerRole] > ACCESS_ROLE_HIERARCHY[targetRole];
};

// Conversion helpers for Prisma enum (AccessRole is identical to DB enum)
export const roleToDbFormat = (role: AccessRole): string => role;
export const roleFromDbFormat = (dbRole: string): AccessRole => {
  if (!Object.values(AccessRole).includes(dbRole as AccessRole)) {
    throw new Error(`Invalid AccessRole value from DB: ${dbRole}`);
  }
  return dbRole as AccessRole;
};

// Type guard for runtime checks
export const isAccessRole = (value: unknown): value is AccessRole => {
  return typeof value === 'string' && Object.values(AccessRole).includes(value as AccessRole);
};

// Default role for new users
export const DEFAULT_ACCESS_ROLE: AccessRole = AccessRole.viewer;
