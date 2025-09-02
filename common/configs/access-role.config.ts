// File: common/configs/access-role.config.ts
// Last change: Fixed inconsistent naming to use snake_case for all functions

import { AccessRole } from '../types/access-role.types';
import { PROJECT_CONFIG } from './project.config';

// Permission utilities
export const has_permission = (user_role: AccessRole, required_role: AccessRole): boolean =>
  PROJECT_CONFIG.access_role_hierarchy[user_role] >= PROJECT_CONFIG.access_role_hierarchy[required_role];

export const can_manage_role = (manager_role: AccessRole, target_role: AccessRole): boolean =>
  PROJECT_CONFIG.access_role_hierarchy[manager_role] > PROJECT_CONFIG.access_role_hierarchy[target_role];

// Default role for new users
export const DEFAULT_ACCESS_ROLE: AccessRole = AccessRole.VIEWER;