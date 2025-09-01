// File: common/configs/universal/colors.config.ts
import type { ProjectOrgType } from '../../types/project/org-type.types';
import type { HslColor } from '../../types/shared/theme.types';

// Neutral fallback colors (apply if no project-specific override exists)
export const DEFAULT_ROLE_COLORS: Partial<Record<ProjectOrgType, HslColor>> = {};

// System-wide semantic colors
export const SYSTEM_COLORS = {
  primary: { h: 0, s: 0, l: 50 },
  textPrimary: { h: 0, s: 0, l: 15 },
  textSecondary: { h: 0, s: 0, l: 45 },
  danger: { h: 0, s: 80, l: 55 },
  success: { h: 140, s: 80, l: 55 },
  warning: { h: 40, s: 80, l: 55 },
  gray: { h: 0, s: 0, l: 50 },
  red: { h: 0, s: 70, l: 50 },
  orange: { h: 30, s: 80, l: 55 },
  green: { h: 140, s: 70, l: 45 },
} as const;
