// File: common/types/universal/color.types.ts

import type { ProjectOrgType } from '../project/org-type.types';
import type { UniversalAuthStatus } from './auth-status.types';

// Base HSL color representation
export interface HslColor {
  h: number;
  s: number;
  l: number;
}

// Semantic levels
export type SemanticLevel = 
  | 'background' | 'surface' | 'input' | 'border' 
  | 'muted' | 'emphasis' | 'hover' | 'active' 
  | 'subtle' | 'overlay' | 'accent' | 'light';

export type SemanticLevelValue = number;

// Role color map
export type RoleColorMap = Record<ProjectOrgType, HslColor>;

// Dot colors
export type DotStatusColorMap = Record<UniversalAuthStatus | 'inactive', string>;
export type DotRoleColorMap = Record<string, string>;
