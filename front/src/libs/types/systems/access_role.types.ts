// File: lakovna/front/src/libs/types/systems/access_role.types.ts
// Last change: Added superadmin and org_admin roles for complete authorization hierarchy

/** Access control roles for authorization system (database-agnostic) */
export type AccessRole = 'superadmin' | 'admin' | 'org_admin' | 'manager' | 'worker' | 'viewer';

/**
 * Role hierarchy for permission checking
 */
export const ACCESS_ROLE_HIERARCHY: Record<AccessRole, number> = {
  superadmin: 6,
  admin: 5,
  org_admin: 4,
  manager: 3, 
  worker: 2,
  viewer: 1
} as const;

/**
 * Permission utilities (database-agnostic)
 */
export const hasPermission = (userRole: AccessRole, requiredRole: AccessRole): boolean => {
  return ACCESS_ROLE_HIERARCHY[userRole] >= ACCESS_ROLE_HIERARCHY[requiredRole];
};

export const canManageRole = (managerRole: AccessRole, targetRole: AccessRole): boolean => {
  return ACCESS_ROLE_HIERARCHY[managerRole] > ACCESS_ROLE_HIERARCHY[targetRole];
};

/**
 * Database format conversion utilities
 * Use when interfacing with Prisma or other ORMs
 */
export const roleToDbFormat = (role: AccessRole): string => role.toUpperCase();
export const roleFromDbFormat = (dbRole: string): AccessRole => dbRole.toLowerCase() as AccessRole;

export const DEFAULT_ACCESS_ROLE: AccessRole = 'viewer';