// File: common/types/theme.types.ts
// Theme-related type contracts (shared across FE/BE)

import type { ThemeMode } from './theme-mode.types';

// Base HSL color representation
export interface HslColor {
  h: number;
  s: number;
  l: number;
}

// Mapping from role key → HSL color (projects can specialize)
export type RoleColorMap = Record<string, HslColor | undefined>;

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

  roleColors?: RoleColorMap;
  activeRole?: string; // project-specific role key (e.g. AppRole, BusinessRole, OrgType)
}
