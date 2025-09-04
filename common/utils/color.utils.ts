// File: common/utils/color.utils.ts
// Last change: Universal color conversion & generation utilities (no project-specific imports)

import type { HslColor } from '../types/project.types';

export const hslToCss = (color: HslColor): string =>
  `${color.h} ${color.s}% ${color.l}%`;

export const createSemanticColor = (baseColor: HslColor, level: number): HslColor => ({
  h: baseColor.h,
  s: baseColor.s,
  l: Math.max(0, Math.min(100, level)),
});

export const determineContrastColor = (color: HslColor): string => {
  return color.l > 50 ? '0 0% 0%' : '0 0% 100%';
};

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

export const isValidHslColor = (color: any): color is HslColor => {
  return (
    typeof color === 'object' &&
    color !== null &&
    typeof color.h === 'number' && color.h >= 0 && color.h <= 360 &&
    typeof color.s === 'number' && color.s >= 0 && color.s <= 100 &&
    typeof color.l === 'number' && color.l >= 0 && color.l <= 100
  );
};

export const lighten = (color: HslColor, amount: number): HslColor => ({
  ...color,
  l: Math.min(100, color.l + amount),
});

export const darken = (color: HslColor, amount: number): HslColor => ({
  ...color,
  l: Math.max(0, color.l - amount),
});

export const saturate = (color: HslColor, amount: number): HslColor => ({
  ...color,
  s: Math.min(100, color.s + amount),
});

export const desaturate = (color: HslColor, amount: number): HslColor => ({
  ...color,
  s: Math.max(0, color.s - amount),
});