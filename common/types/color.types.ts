// File: common/types/color.types.ts
// Color-related type contracts (HSL, semantic levels, role/dot mappings)

// Base HSL color representation
export interface HslColor {
  h: number;
  s: number;
  l: number;
}

// Semantic levels for theming
export type SemanticLevel =
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

export type SemanticLevelValue = number;

// Generic role → color map (project-specific configs can narrow it)
export type RoleColorMap<T extends string = string> = Record<T, HslColor>;

// Dot system colors
export type DotStatusColorMap<T extends string = string> = Record<T, string>;
export type DotRoleColorMap = Record<string, string>;
