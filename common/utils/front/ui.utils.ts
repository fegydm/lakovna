// File: common/utils/front/ui.utils.ts
// Last change: Moved UI-specific color generation utilities from color.utils.ts

import type { HslColor } from '../../types/color.types';
import type { ThemeSettings } from '../../types/theme.types';
import { hsl_to_css, create_semantic_color, determine_contrast_color } from '../color.utils';

export const generate_system_variables = (
  typography: ThemeSettings['typography'],
  layout: ThemeSettings['layout'],
  text_primary: HslColor,
  text_secondary: HslColor
): Record<string, string> => {
  const v: Record<string, string> = {};
  v['--text-primary'] = hsl_to_css(text_primary);
  v['--text-secondary'] = hsl_to_css(text_secondary);
  v['--text-tertiary'] = hsl_to_css({ ...text_secondary, l: Math.min(100, text_secondary.l + 20) });
  v['--text-inverse'] = '0 0% 100%';
  v['--text-muted'] = v['--text-secondary'];

  v['--border-radius'] = `${layout.border_radius}px`;
  v['--border-radius-sm'] = `${layout.border_radius * 0.5}px`;
  v['--border-radius-md'] = `${layout.border_radius}px`;
  v['--border-radius-lg'] = `${layout.border_radius * 1.5}px`;
  v['--border-radius-xl'] = `${layout.border_radius * 2}px`;

  const base_size = typography.font_size_base;
  v['--font-size-xs'] = `${base_size * 0.75}px`;
  v['--font-size-sm'] = `${base_size * 0.875}px`;
  v['--font-size-base'] = `${base_size}px`;
  v['--font-size-lg'] = `${base_size * 1.125}px`;
  v['--font-size-xl'] = `${base_size * 1.25}px`;
  v['--font-size-2xl'] = `${base_size * 1.5}px`;
  v['--font-size-3xl'] = `${base_size * 1.875}px`;

  v['--font-family-base'] = 'Inter, system-ui, sans-serif';
  v['--font-family-mono'] = 'Fira Code, Consolas, Monaco, monospace';

  const base_spacing = 4;
  v['--spacing-xs'] = `${base_spacing}px`;
  v['--spacing-sm'] = `${base_spacing * 2}px`;
  v['--spacing-md'] = `${base_spacing * 4}px`;
  v['--spacing-lg'] = `${base_spacing * 6}px`;
  v['--spacing-xl'] = `${base_spacing * 8}px`;
  v['--spacing-2xl'] = `${base_spacing * 12}px`;

  return v;
};

export const generate_system_semantic_variables = (
  adjust: (level: number, name: string) => number,
  base_color: HslColor,
  levels: Record<string, number>
): Record<string, string> => {
  const out: Record<string, string> = {};
  Object.entries(levels).forEach(([name, level_value]) => {
    const adjusted_level = Math.max(0, Math.min(100, adjust(level_value, name)));
    out[`--sys-${name}`] = `${base_color.h} ${base_color.s}% ${adjusted_level}%`;
  });
  return out;
};

export const generate_semantic_color_system = (colors: Record<string, HslColor>): Record<string, string> => {
  const out: Record<string, string> = {};
  Object.entries(colors).forEach(([name, color]) => {
    out[`--${name}-hsl`] = hsl_to_css(color);
    out[`--${name}-contrast-hsl`] = determine_contrast_color(color);
    out[`--${name}-hover-hsl`] = hsl_to_css(create_semantic_color(color, Math.max(0, color.l - 10)));
  });
  return out;
};

export const generate_button_shadows = (): Record<string, string> => ({
  '--button-shadow': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  '--button-shadow-focus': '0 0 0 3px rgba(66, 153, 225, 0.2)',
  '--button-shadow-floating': '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
  '--button-shadow-floating-hover': '0 8px 24px 0 rgba(0, 0, 0, 0.2)',
});