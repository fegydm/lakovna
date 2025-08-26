// File: lakovna/front/src/libs/utils/role.utils.ts
// Last change: Mapping utilities between app roles and access roles

import type { AppRole } from '@/libs/types/systems/app_role.types';
import type { AccessRole } from '@/libs/types/systems/access_role.types';

/**
 * Convert app role to access role for authorization checks
 */
export const appToAccess = (appRole: AppRole): AccessRole => appRole;

/**
 * Convert access role to app role for UI purposes
 */
export const accessToApp = (accessRole: AccessRole): AppRole => accessRole;

/**
 * Type guard to check if string is valid AppRole
 */
export const isValidAppRole = (role: string): role is AppRole => {
  return ['admin', 'manager', 'worker', 'viewer'].includes(role);
};

/**
 * Type guard to check if string is valid AccessRole
 */
export const isValidAccessRole = (role: string): role is AccessRole => {
  return ['admin', 'manager', 'worker', 'viewer'].includes(role);
};