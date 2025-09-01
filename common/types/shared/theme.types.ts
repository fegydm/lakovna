// File: common/types/shared/theme.types.ts
// Last change: Centralized ThemeSettings shared between FE/BE, imports ThemeMode from universal

import type { ThemeMode } from '../universal/theme-mode.types';

// Basic HSL color representation
export interface HslColor {
  h: number;
  s: number;
  l: number;
}

// Role-to-color mapping
export type RoleColorMap = Record<string, HslColor | undefined>;

// Theme settings used across frontend (UI) and backend (branding/exports)
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
  activeRole?: string; // project-specific role (AppRole, ProjectRole, etc.)
}
