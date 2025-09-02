// File: common/types/dot-system.types.ts
// Last change: Updated DotCategoryConfig to use HslColor for consistency

import type { ProjectCategory } from './project-category.types';
import type { AuthStatus } from './auth.types';
import type { HslColor } from './color.types';

// Row 1: Project-specific categories
export type DotCategory = ProjectCategory;

export interface DotCategoryConfig {
  label: string;
  description: string;
  color: HslColor;
  icon: string;
}

// Row 2: Universal auth statuses
export type DotStatus = AuthStatus;

export interface DotStatusConfig {
  label: string;
  description: string;
  color: HslColor;
  icon: string;
}