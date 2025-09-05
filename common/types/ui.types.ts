// File: common/types/ui.types.ts
// Last change: Initial atomization from project.types.ts.
// Contains all types related to UI, theming, colors, and visual components.

import { PROJECT_COLOR_CONFIG } from '../configs/02-colors.config';
import { UI_CONFIG } from '../configs/04-ui.config';

export type ThemeMode = 'light' | 'dark';

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export type ColorMap<T extends string = string> = Record<T, HslColor>;

export type SemanticColor =
  | 'background'
  | 'surface'
  | 'input'
  | 'border'
  | 'muted'
  | 'emphasis'
  | 'hover'
  | 'active'
  | 'subtle'
  | 'overlay'
  | 'accent'
  | 'light';

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

export interface ThemeRoleColorMap {
  [key: string]: HslColor;
}

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

export type BrandingColor = keyof typeof PROJECT_COLOR_CONFIG.systemColors;
export type SystemColor = keyof typeof PROJECT_COLOR_CONFIG.systemColors;
export type PlatformCategory =
  typeof UI_CONFIG.platformCategoryMappings[keyof typeof UI_CONFIG.platformCategoryMappings];