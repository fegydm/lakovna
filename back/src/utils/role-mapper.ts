// File: back/src/utils/role-mapper.ts
// Utility: Convert raw DB role strings into AccessRole safely (CORRECTED)

import type { AccessRole } from 'common/types/project.types';
import { ACCESS_ROLES } from 'common/configs/01-constants.config';

// FIX: Explicitly type the array as string[] to satisfy the .includes() method.
const VALID_ROLES: string[] = Object.values(ACCESS_ROLES);

/**
 * Safely converts a raw DB role string into a validated AccessRole type.
 * Falls back to 'viewer' if the role is invalid, null, or undefined.
 */
export function safeRoleFromDbFormat(dbRole: string | null | undefined): AccessRole {
  // Now this check works without a TypeScript error.
  if (dbRole && VALID_ROLES.includes(dbRole)) {
    return dbRole as AccessRole;
  }

  if (dbRole) {
    console.warn(`[role-mapper] Invalid role from DB: "${dbRole}", falling back to "viewer"`);
  }
  
  return ACCESS_ROLES.VIEWER;
}