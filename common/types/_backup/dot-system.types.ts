// File: common/types/dot-system.types.ts
// Last change: Consolidated UX visualization types and removed redundant aliases.

import type { ProjectCategory } from './project-category.types';
import type { AuthStatus } from './auth-status.types';
import type { HslColor } from './color.types';

export interface DotCategoryConfig {
  label: string;
  description: string;
  color: HslColor;
  icon: string;
}

export interface DotStatusConfig {
  label: string;
  description: string;
  color: HslColor;
  icon: string;
}

// These types are used as keys for dot system configuration
export type DotCategoryKey = ProjectCategory;
export type DotStatusKey = AuthStatus;