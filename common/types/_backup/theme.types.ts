// File: common/types/theme.types.ts
// Last change: Updated types for consistency with color.types.ts and naming conventions

import type { ThemeMode } from './theme-mode.types';
import type { HslColor } from './color.types';

// Mapping from role key → HSL color (projects can specialize)
export type ThemeRoleColorMap = Record<string, HslColor>;

// Global theme settings (used in FE for UI, in BE for exports/branding)
export interface ThemeSettings {
  primaryColor: HslColor;
  secondaryColor?: HslColor;

  mode: ThemeMode;

  typography: {
    fontSizeBase: number;
  };

  layout: {
    borderRadius: number;
  };

  roleColors?: ThemeRoleColorMap;
  activeRole?: string;
}