// File: common/utils/color.utils.ts
// Last change: Universal color conversion & generation utilities (no project-specific imports)

import type { HslColor } from 'common/types/shared/theme.types';

export const hslToCss = (color: HslColor): string =>
  `${color.h} ${color.s}% ${color.l}%`;

export const createSemanticColor = (baseColor: HslColor, level: number): HslColor => ({
  h: baseColor.h,
  s: baseColor.s,
  l: Math.max(0, Math.min(100, level)),
});

export const generateSystemVariables = (
  typography: { fontSizeBase: number },
  layout: { borderRadius: number },
  textPrimary: HslColor,
  textSecondary: HslColor
): Record<string, string> => {
  const v: Record<string, string> = {};
  v['--text-primary'] = hslToCss(textPrimary);
  v['--text-secondary'] = hslToCss(textSecondary);
  v['--text-tertiary'] = hslToCss({ ...textSecondary, l: Math.min(100, textSecondary.l + 20) });
  v['--text-inverse'] = '0 0% 100%';
  v['--text-muted'] = v['--text-secondary'];

  v['--border-radius'] = `${layout.borderRadius}px`;
  v['--border-radius-sm'] = `${layout.borderRadius * 0.5}px`;
  v['--border-radius-md'] = `${layout.borderRadius}px`;
  v['--border-radius-lg'] = `${layout.borderRadius * 1.5}px`;
  v['--border-radius-xl'] = `${layout.borderRadius * 2}px`;

  const baseSize = typography.fontSizeBase;
  v['--font-size-xs'] = `${baseSize * 0.75}px`;
  v['--font-size-sm'] = `${baseSize * 0.875}px`;
  v['--font-size-base'] = `${baseSize}px`;
  v['--font-size-lg'] = `${baseSize * 1.125}px`;
  v['--font-size-xl'] = `${baseSize * 1.25}px`;
  v['--font-size-2xl'] = `${baseSize * 1.5}px`;
  v['--font-size-3xl'] = `${baseSize * 1.875}px`;

  v['--font-family-base'] = 'Inter, system-ui, sans-serif';
  v['--font-family-mono'] = 'Fira Code, Consolas, Monaco, monospace';

  const baseSpacing = 4;
  v['--spacing-xs'] = `${baseSpacing}px`;
  v['--spacing-sm'] = `${baseSpacing * 2}px`;
  v['--spacing-md'] = `${baseSpacing * 4}px`;
  v['--spacing-lg'] = `${baseSpacing * 6}px`;
  v['--spacing-xl'] = `${baseSpacing * 8}px`;
  v['--spacing-2xl'] = `${baseSpacing * 12}px`;

  return v;
};

export const generateSystemSemanticVariables = (
  adjust: (level: number, name: string) => number,
  baseColor: HslColor,
  levels: Record<string, number>
): Record<string, string> => {
  const out: Record<string, string> = {};
  Object.entries(levels).forEach(([name, levelValue]) => {
    const adjustedLevel = Math.max(0, Math.min(100, adjust(levelValue, name)));
    out[`--sys-${name}`] = `${baseColor.h} ${baseColor.s}% ${adjustedLevel}%`;
  });
  return out;
};

export const generateSemanticColorSystem = (colors: Record<string, HslColor>): Record<string, string> => {
  const out: Record<string, string> = {};
  Object.entries(colors).forEach(([name, color]) => {
    out[`--${name}-hsl`] = hslToCss(color);
    out[`--${name}-contrast-hsl`] = determineContrastColor(color);
    out[`--${name}-hover-hsl`] = hslToCss(createSemanticColor(color, Math.max(0, color.l - 10)));
  });
  return out;
};

export const generateButtonShadows = (): Record<string, string> => ({
  '--button-shadow': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  '--button-shadow-focus': '0 0 0 3px rgba(66, 153, 225, 0.2)',
  '--button-shadow-floating': '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
  '--button-shadow-floating-hover': '0 8px 24px 0 rgba(0, 0, 0, 0.2)',
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
  let sPerc = 0;

  if (diff !== 0) {
    sPerc = l > 0.5 ? diff / (2 - sum) : diff / sum;
    switch (max) {
      case rf: h = ((gf - bf) / diff + (gf < bf ? 6 : 0)); break;
      case gf: h = (bf - rf) / diff + 2; break;
      default: h = (rf - gf) / diff + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(sPerc * 100),
    l: Math.round(l * 100),
  };
};

export const hslToHex = (color: HslColor): string => {
  const h = color.h / 360;
  const s = color.s / 100;
  const l = color.l / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
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
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
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
