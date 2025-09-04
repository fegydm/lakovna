// File: common/types/color.types.ts
// Last change: Consolidated color types for better consistency and reusability

// Base HSL color representation
export interface HslColor {
  h: number;
  s: number;
  l: number;
}

// Map of a given key to an HSL color
export type ColorMap<T extends string = string> = Record<T, HslColor>;

// Semantic levels for theming
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