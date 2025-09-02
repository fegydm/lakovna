// File: common/configs/universal-colors.config.ts
// Last change: Consolidated color configurations into a single object and applied snake_case naming

import type { HslColor } from '../types/color.types';

export const UNIVERSAL_COLORS = {
  // Neutral fallback colors (apply if no project-specific override exists)
  default_role_colors: {} as Record<string, HslColor>,

  // System-wide semantic colors
  system_colors: {
    text_primary: { h: 0, s: 0, l: 15 },
    text_secondary: { h: 0, s: 0, l: 45 },
    danger: { h: 0, s: 80, l: 55 },
    success: { h: 140, s: 80, l: 55 },
    warning: { h: 40, s: 80, l: 55 },
    gray: { h: 0, s: 0, l: 50 },
    red: { h: 0, s: 70, l: 50 },
    orange: { h: 30, s: 80, l: 55 },
    green: { h: 140, s: 70, l: 45 },
  } as Record<string, HslColor>,
};