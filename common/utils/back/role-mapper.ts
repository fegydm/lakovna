// File: common/utils/back/role-mapper.ts
// Utility: Convert raw DB role strings into AccessRole safely

import { AccessRole } from 'common/types/access-role.types';

/**
 * Safely converts raw DB role string into AccessRole.
 * Falls back to `viewer` if invalid.
 */
export function safeRoleFromDbFormat(dbRole: string): AccessRole {
  if (Object.values(AccessRole).includes(dbRole as AccessRole)) {
    return dbRole as AccessRole;
  }

  console.warn(`[role-mapper] Invalid role from DB: "${dbRole}", falling back to "viewer"`);
  return AccessRole.viewer;
}
