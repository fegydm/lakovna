// File: common/utils/color.utils.ts
// Last change: Updated type imports and added JSDoc documentation.

// ZMENA: Importujeme z ui.types.ts, kam HslColor po refaktoringu patrí.
import type { HslColor } from '../types/ui.types';


// =====================================================================
// PRIDANÉ: Funkcie pre Bridge vrstvu (DB <-> Aplikácia)
// =====================================================================

/**
 * Parses a "h,s,l" string from the database into an HslColor object.
 * Returns null if the string is invalid or null/undefined.
 * @param hslString The HSL string from the database (e.g., "220,89,60").
 */
export const parseHslString = (hslString: string | null | undefined): HslColor | null => {
  if (!hslString) {
    return null;
  }
  const parts = hslString.split(',').map(Number);
  if (parts.length === 3 && !parts.some(isNaN)) {
    return { h: parts[0], s: parts[1], l: parts[2] };
  }
  return null; // Invalid format
};

/**
 * Formats an HslColor object into a "h,s,l" string for saving to the database.
 * @param color The HslColor object.
 * @returns A string for database storage (e.g., "220,89,60").
 */
export const formatHslObject = (color: HslColor): string => {
  return `${color.h},${color.s},${color.l}`;
};


/**
 * Converts an HslColor object to a string of values for use inside the CSS hsl() function.
 * @param color The HslColor object.
 * @returns A string like "220 89% 54%".
 */
export const hslToCss = (color: HslColor): string =>
  `${color.h} ${color.s}% ${color.l}%`;

/**
 * Creates a new HslColor based on a base color but with a specific lightness level.
 * @param baseColor The base HslColor to take hue and saturation from.
 * @param level The desired lightness (0-100).
 * @returns A new HslColor object.
 */
export const createSemanticColor = (baseColor: HslColor, level: number): HslColor => ({
  h: baseColor.h,
  s: baseColor.s,
  l: Math.max(0, Math.min(100, level)),
});

/**
 * Determines a contrasting color (black or white) for a given HslColor.
 * @param color The HslColor object.
 * @returns A CSS HSL value string for black or white.
 */
export const determineContrastColor = (color: HslColor): string => {
  return color.l > 50 ? '0 0% 0%' : '0 0% 100%'; // Black for light, White for dark
};

/**
 * Converts a HEX color string to an HslColor object.
 * @param hex The hex color string (e.g., "#3498db" or "3498db").
 * @returns An HslColor object.
 */
export const hexToHsl = (hex: string): HslColor => {
  const s = hex.trim().replace(/^#/, '').toLowerCase();
  const expand = (ch: string) => ch + ch;
  let r: number, g: number, b: number;

  if (s.length === 3 || s.length === 4) {
    r = parseInt(expand(s[0]), 16);
    g = parseInt(expand(s[1]), 16);
    b = parseInt(expand(s[2]), 16);
  } else if (s.length === 6 || s.length === 8) {
    r = parseInt(s.slice(0, 2), 16);
    g = parseInt(s.slice(2, 4), 16);
    b = parseInt(s.slice(4, 6), 16);
  } else {
    // Return a default color for invalid input
    return { h: 0, s: 0, l: 50 }; 
  }

  const rf = r / 255, gf = g / 255, bf = b / 255;
  const max = Math.max(rf, gf, bf);
  const min = Math.min(rf, gf, bf);
  const diff = max - min;
  const sum = max + min;
  const l = sum / 2;

  let h = 0;
  let s_perc = 0;

  if (diff !== 0) {
    s_perc = l > 0.5 ? diff / (2 - sum) : diff / sum;
    switch (max) {
      case rf: h = ((gf - bf) / diff + (gf < bf ? 6 : 0)); break;
      case gf: h = (bf - rf) / diff + 2; break;
      default: h = (rf - gf) / diff + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s_perc * 100),
    l: Math.round(l * 100),
  };
};

/**
 * Converts an HslColor object to a HEX color string.
 * @param color The HslColor object.
 * @returns A hex color string (e.g., "#3498db").
 */
export const hslToHex = (color: HslColor): string => {
  const h = color.h / 360;
  const s = color.s / 100;
  const l = color.l / 100;

  const hueToRgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * Type guard to check if an object is a valid HslColor.
 * @param color The value to check.
 * @returns True if the value is a valid HslColor object.
 */
export const isValidHslColor = (color: any): color is HslColor => {
  return (
    typeof color === 'object' &&
    color !== null &&
    typeof color.h === 'number' && color.h >= 0 && color.h <= 360 &&
    typeof color.s === 'number' && color.s >= 0 && color.s <= 100 &&
    typeof color.l === 'number' && color.l >= 0 && color.l <= 100
  );
};

/**
 * Increases the lightness of a color by a given amount.
 * @param color The original HslColor object.
 * @param amount The amount to increase lightness by (0-100).
 * @returns A new, lighter HslColor object.
 */
export const lighten = (color: HslColor, amount: number): HslColor => ({
  ...color,
  l: Math.min(100, color.l + amount),
});

/**
 * Decreases the lightness of a color by a given amount.
 * @param color The original HslColor object.
 * @param amount The amount to decrease lightness by (0-100).
 * @returns A new, darker HslColor object.
 */
export const darken = (color: HslColor, amount: number): HslColor => ({
  ...color,
  l: Math.max(0, color.l - amount),
});

/**
 * Increases the saturation of a color by a given amount.
 * @param color The original HslColor object.
 * @param amount The amount to increase saturation by (0-100).
 * @returns A new, more saturated HslColor object.
 */
export const saturate = (color: HslColor, amount: number): HslColor => ({
  ...color,
  s: Math.min(100, color.s + amount),
});

/**
 * Decreases the saturation of a color by a given amount.
 * @param color The original HslColor object.
 * @param amount The amount to decrease saturation by (0-100).
 * @returns A new, less saturated HslColor object.
 */
export const desaturate = (color: HslColor, amount: number): HslColor => ({
  ...color,
  s: Math.max(0, color.s - amount),
});