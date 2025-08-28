// File: common/types/access-role.types.ts
// Last change: Synced AccessRole with WorkerRole enum from Prisma schema, added permission utilities

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

// Conversion helpers for Prisma WorkerRole
export const roleToDbFormat = (role: AccessRole): string => role;
export const roleFromDbFormat = (dbRole: string): AccessRole =>
  dbRole as AccessRole;

export const DEFAULT_ACCESS_ROLE: AccessRole = AccessRole.viewer;

