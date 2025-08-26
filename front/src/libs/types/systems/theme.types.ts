// File: lakovna/front/src/libs/types/systems/theme.types.ts
// Last change: Modular theme types importing from dedicated role and mode files

import type { AppRole } from './app_role.types';
import type { ThemeMode } from './theme_mode.types';

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export type RoleColorMap = Partial<Record<AppRole, HslColor>> & {
  [role: string]: HslColor | undefined;
};

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
  activeRole?: AppRole;
}