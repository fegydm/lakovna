// File: common/configs/02-colors.config.ts
// Last change: Updated type imports after atomization of project types.

// ZMENA: Importujeme z ui.types.ts, kam HslColor po refaktoringu patrí.
import type { HslColor } from '../types/ui.types';
import { PROJECT_ORG_TYPES } from './01-constants.config';

export const PROJECT_COLOR_CONFIG = {
  projectRoleColors: {
    [PROJECT_ORG_TYPES.BODYSHOP]: { h: 120, s: 40, l: 55 },
    [PROJECT_ORG_TYPES.SERVICE]: { h: 280, s: 60, l: 60 },
    [PROJECT_ORG_TYPES.DEALER]: { h: 210, s: 50, l: 60 },
    [PROJECT_ORG_TYPES.TUNING]: { h: 40, s: 80, l: 55 },
    [PROJECT_ORG_TYPES.WRAPSHOP]: { h: 30, s: 70, l: 60 },
    [PROJECT_ORG_TYPES.DETAILING]: { h: 200, s: 50, l: 50 },
  } as Record<typeof PROJECT_ORG_TYPES[keyof typeof PROJECT_ORG_TYPES], HslColor>,

  cssRoleMap: {
    [PROJECT_ORG_TYPES.BODYSHOP]: 'bsh',
    [PROJECT_ORG_TYPES.SERVICE]: 'svc',
    [PROJECT_ORG_TYPES.DEALER]: 'dlr',
    [PROJECT_ORG_TYPES.TUNING]: 'tun',
    [PROJECT_ORG_TYPES.WRAPSHOP]: 'wrp',
    [PROJECT_ORG_TYPES.DETAILING]: 'det',
  } as Record<typeof PROJECT_ORG_TYPES[keyof typeof PROJECT_ORG_TYPES], string>,

  defaultRoleColors: {} as Record<string, HslColor>,

  systemColors: {
    textPrimary: { h: 0, s: 0, l: 15 },
    textSecondary: { h: 0, s: 0, l: 45 },
    danger: { h: 0, s: 80, l: 55 },
    success: { h: 140, s: 80, l: 55 },
    warning: { h: 40, s: 80, l: 55 },
    gray: { h: 0, s: 0, l: 50 },
    red: { h: 0, s: 70, l: 50 },
    orange: { h: 30, s: 80, l: 55 },
    green: { h: 140, s: 70, l: 45 },
    primary: { h: 224, s: 80, l: 50 },
    info: { h: 195, s: 80, l: 50 },
    purple: { h: 260, s: 80, l: 55 },
    pink: { h: 330, s: 70, l: 60 },
  } as Record<string, HslColor>,
};