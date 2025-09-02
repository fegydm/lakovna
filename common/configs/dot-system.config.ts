// File: common/configs/dot-system.config.ts
// Last change: Updated to unify dot system with existing project configurations

import type { DotCategoryConfig, DotStatusConfig } from '../types/dot-system.types';
import { ProjectCategory } from '../types/project-category.types';
import { AuthStatus } from '../types/auth.types';
import { PROJECT_CONFIG } from './project.config';
import { AUTH_STATUS_COLORS, AUTH_STATUS_LABELS } from './auth.config';

// Row 1: Project-specific categories
export const DOT_CATEGORIES: Record<ProjectCategory, DotCategoryConfig> = {
  [ProjectCategory.PAINT]: PROJECT_CONFIG.dot_category_ui[ProjectCategory.PAINT],
  [ProjectCategory.MECHANICAL]: PROJECT_CONFIG.dot_category_ui[ProjectCategory.MECHANICAL],
  [ProjectCategory.FULL_SERVICE]: PROJECT_CONFIG.dot_category_ui[ProjectCategory.FULL_SERVICE],
};

// Row 2: Universal authentication statuses
export const DOT_STATUSES: Record<AuthStatus, DotStatusConfig> = {
  [AuthStatus.ANONYMOUS]: {
    label: AUTH_STATUS_LABELS[AuthStatus.ANONYMOUS],
    description: 'User without authentication (guest)',
    color: AUTH_STATUS_COLORS[AuthStatus.ANONYMOUS],
    icon: '👤',
  },
  [AuthStatus.COOKIES]: {
    label: AUTH_STATUS_LABELS[AuthStatus.COOKIES],
    description: 'Authenticated via cookies/session',
    color: AUTH_STATUS_COLORS[AuthStatus.COOKIES],
    icon: '🍪',
  },
  [AuthStatus.REGISTERED]: {
    label: AUTH_STATUS_LABELS[AuthStatus.REGISTERED],
    description: 'Fully authenticated user',
    color: AUTH_STATUS_COLORS[AuthStatus.REGISTERED],
    icon: '✅',
  },
};