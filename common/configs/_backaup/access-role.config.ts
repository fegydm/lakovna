// File: common/configs/access-role.config.ts
// Last change: Consolidated all access role configurations and utilities into a single file.

import { PROJECT_CONFIG } from './project backup.config';
import type { AccessRole } from '../types/access-role.types';

// The single source of truth for all access role values
export const ACCESS_ROLES = {
  SUPERADMIN: 'superadmin',
  DEVELOPER: 'developer',
  OWNER: 'owner',
  MANAGER: 'manager',
  COORDINATOR: 'coordinator',
  WORKER: 'worker',
  PARTNER: 'partner',
  VIEWER: 'viewer',
} as const;

// Default role for new users
export const DEFAULT_ACCESS_ROLE: AccessRole = ACCESS_ROLES.VIEWER;

// Permission utilities
export const hasPermission = (userRole: AccessRole, requiredRole: AccessRole): boolean =>
  PROJECT_CONFIG.accessRoleHierarchy[userRole] >= PROJECT_CONFIG.accessRoleHierarchy[requiredRole];

export const canManageRole = (managerRole: AccessRole, targetRole: AccessRole): boolean =>
  PROJECT_CONFIG.accessRoleHierarchy[managerRole] > PROJECT_CONFIG.accessRoleHierarchy[targetRole];