// File: common/utils/front/theme.utils.ts
// Last change: Moved from front/src/utils → common/utils/front with relative imports

import type { ThemeMode } from '../../types/theme-mode.types';
import type { HslColor } from '../../types/theme.types';

/**
 * Converts an HSL color object to a CSS hsl() string.
 */
export const hslToCss = (color: HslColor): string => {
  return `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
};

/**
 * Parses a CSS hsl() string into an HslColor object.
 */
export const parseCssHsl = (css: string): HslColor | null => {
  const match = css.match(/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/);
  if (!match) return null;
  return {
    h: parseInt(match[1], 10),
    s: parseInt(match[2], 10),
    l: parseInt(match[3], 10),
  };
};

/**
 * Returns the opposite theme mode.
 */
export const toggleThemeMode = (mode: ThemeMode): ThemeMode =>
  mode === 'light' ? 'dark' : 'light';

/**
 * Lightens or darkens an HSL color by a given percentage.
 */
export const adjustLightness = (color: HslColor, amount: number): HslColor => {
  return { ...color, l: Math.min(100, Math.max(0, color.l + amount)) };
};

/**
 * Checks if current theme mode is dark.
 */
export const isDarkMode = (mode: ThemeMode): boolean => mode === 'dark';
