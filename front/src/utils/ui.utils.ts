// File: front/src/utils/ui.utils.ts
// Last change: Moved UI-specific color generation utilities from color.utils.ts

import type { HslColor, ThemeSettings } from 'common/types/project.types';
import { hslToCss, createSemanticColor, determineContrastColor } from 'common/utils/color.utils';

export const generateSystemVariables = (
  typography: ThemeSettings['typography'],
  layout: ThemeSettings['layout'],
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