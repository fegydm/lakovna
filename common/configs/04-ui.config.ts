// File: common/configs/04-ui.config.ts
// Last change: Consolidated all UI-related configurations.

import { AUTH_STATUSES, PROJECT_CATEGORIES, PROJECT_ORG_TYPES } from './01-constants.config';
import { PROJECT_COLOR_CONFIG } from './02-colors.config';
import type { HslColor, DotCategoryConfig, ProjectOrgTypeDetails, AuthStatus } from '../types/project.types';

export const UI_CONFIG = {
  routing: {
    homepage: {
      type: 'orgSelector',
      defaultOrg: PROJECT_ORG_TYPES.BODYSHOP,
    },
    paths: {
      [PROJECT_ORG_TYPES.BODYSHOP]: '/',
      [PROJECT_ORG_TYPES.SERVICE]: '/service',
      [PROJECT_ORG_TYPES.DEALER]: '/dealer',
      [PROJECT_ORG_TYPES.TUNING]: '/tuning',
      [PROJECT_ORG_TYPES.WRAPSHOP]: '/wrap',
      [PROJECT_ORG_TYPES.DETAILING]: '/detailing',
    },
  },
  branding: {
    colors: {
      primary: PROJECT_COLOR_CONFIG.projectRoleColors.bodyshop as HslColor,
      secondary: PROJECT_COLOR_CONFIG.projectRoleColors.service as HslColor,
      accent: PROJECT_COLOR_CONFIG.projectRoleColors.dealer as HslColor,
    },
    logo: {
      text: '🏭 Lakovňa',
      icon: '🏭',
    },
    theme: 'light',
  },
  dotCategoryUi: {
    [PROJECT_CATEGORIES.PAINT]: {
      label: 'Karoséria & Vizuál',
      description: 'Zamerané na vizuálne úpravy a lakovanie vozidiel.',
      color: PROJECT_COLOR_CONFIG.projectRoleColors.bodyshop as HslColor,
      icon: '🎨',
    },
    [PROJECT_CATEGORIES.MECHANICAL]: {
      label: 'Mechanika & Servis',
      description: 'Komplexná diagnostika a oprava mechanických častí.',
      color: PROJECT_COLOR_CONFIG.projectRoleColors.service as HslColor,
      icon: '🔧',
    },
    [PROJECT_CATEGORIES.FULL_SERVICE]: {
      label: 'Komplexné služby',
      description: 'Poskytuje kompletné služby od laku až po motor.',
      color: PROJECT_COLOR_CONFIG.projectRoleColors.dealer as HslColor,
      icon: '🏪',
    },
  } as Record<typeof PROJECT_CATEGORIES[keyof typeof PROJECT_CATEGORIES], DotCategoryConfig>,
  platformCategoryMappings: {
    [PROJECT_CATEGORIES.PAINT]: 'A',
    [PROJECT_CATEGORIES.MECHANICAL]: 'B',
    [PROJECT_CATEGORIES.FULL_SERVICE]: 'AB',
  },
  organizationTypeMappings: {
    [PROJECT_ORG_TYPES.BODYSHOP]: {
      key: PROJECT_ORG_TYPES.BODYSHOP,
      label: 'Karosárska dielňa',
      description: 'Špecializácia na opravy karosérií a lakovanie.',
      category: PROJECT_CATEGORIES.PAINT,
    },
    [PROJECT_ORG_TYPES.SERVICE]: {
      key: PROJECT_ORG_TYPES.SERVICE,
      label: 'Autoservis',
      description: 'Opravy a údržba motorov a mechanických komponentov.',
      category: PROJECT_CATEGORIES.MECHANICAL,
    },
    [PROJECT_ORG_TYPES.DEALER]: {
      key: PROJECT_ORG_TYPES.DEALER,
      label: 'Autorizovaný dealer',
      description: 'Široké spektrum služieb pre konkrétnu značku vozidiel.',
      category: PROJECT_CATEGORIES.FULL_SERVICE,
    },
    [PROJECT_ORG_TYPES.TUNING]: {
      key: PROJECT_ORG_TYPES.TUNING,
      label: 'Tuning centrum',
      description: 'Úpravy výkonu a dizajnu vozidiel.',
      category: PROJECT_CATEGORIES.MECHANICAL,
    },
    [PROJECT_ORG_TYPES.WRAPSHOP]: {
      key: PROJECT_ORG_TYPES.WRAPSHOP,
      label: 'Wrap dielňa',
      description: 'Inštalácia fólií a polepov na vozidlá.',
      category: PROJECT_CATEGORIES.PAINT,
    },
    [PROJECT_ORG_TYPES.DETAILING]: {
      key: PROJECT_ORG_TYPES.DETAILING,
      label: 'Detailing centrum',
      description: 'Profesionálne čistenie a ochrana vozidiel.',
      category: PROJECT_CATEGORIES.PAINT,
    },
  } as Record<typeof PROJECT_ORG_TYPES[keyof typeof PROJECT_ORG_TYPES], ProjectOrgTypeDetails>,
  authStatusLabels: {
    [AUTH_STATUSES.ANONYMOUS]: 'Anonymous',
    [AUTH_STATUSES.COOKIES]: 'Temporary',
    [AUTH_STATUSES.REGISTERED]: 'Registered',
  } as Record<AuthStatus, string>,
  authStatusColors: {
    [AUTH_STATUSES.ANONYMOUS]: { h: 220, s: 10, l: 80 },
    [AUTH_STATUSES.COOKIES]: { h: 42, s: 94, l: 60 },
    [AUTH_STATUSES.REGISTERED]: { h: 140, s: 76, l: 40 },
  } as Record<AuthStatus, HslColor>,
};