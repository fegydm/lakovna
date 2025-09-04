// File: common/configs/project.config.ts
// Last change: Corrected all naming conventions and refactored imports for consistency.

import type { HslColor } from '../../types/color.types';
import type { DotCategoryConfig } from '../types/dot-system.types';
import type { ProjectOrgTypeDetails } from '../types/organization.types';
import type { VehicleInfo } from '../types/vehicle backup.types';
import type { ProjectConfig } from '../types/project-config.types';

// Import runtime values from dedicated config files
import { PROJECT_COLOR_CONFIG } from '../project-colors.config';
import { PROJECT_CATEGORIES } from './project-category.config';
import { ACCESS_ROLES } from './access-role.configgg';
import { BUSINESS_ROLES_BASE } from './business-roles.config';
import { TASK_PROGRESS_STATUSES } from './task-progress-status.config';
import { PLATFORM_CATEGORIES } from './platform-category.config';
import { PROJECT_ORG_TYPES } from './organization-types.config';
import { STAGE_PIPELINE, DEFAULT_VEHICLES, STAGE_TEMPLATES } from '../project-defaults.config';


export const PROJECT_CONFIG = {
  // =================================================================
  //  SECTION 1: Project-specific Mappings
  // =================================================================

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
  } as Record<typeof PROJECT_CATEGORIES[number], DotCategoryConfig>,

  platformCategoryMappings: {
    [PROJECT_CATEGORIES.PAINT]: PLATFORM_CATEGORIES[0],
    [PROJECT_CATEGORIES.MECHANICAL]: PLATFORM_CATEGORIES[1],
    [PROJECT_CATEGORIES.FULL_SERVICE]: PLATFORM_CATEGORIES[2],
  },

  organizationTypeMappings: {
    [PROJECT_ORG_TYPES[0]]: { // 'bodyshop'
      key: PROJECT_ORG_TYPES[0],
      label: 'Karosárska dielňa',
      description: 'Špecializácia na opravy karosérií a lakovanie.',
      category: PROJECT_CATEGORIES.PAINT,
    },
    [PROJECT_ORG_TYPES[1]]: { // 'service'
      key: PROJECT_ORG_TYPES[1],
      label: 'Autoservis',
      description: 'Opravy a údržba motorov a mechanických komponentov.',
      category: PROJECT_CATEGORIES.MECHANICAL,
    },
    [PROJECT_ORG_TYPES[2]]: { // 'dealer'
      key: PROJECT_ORG_TYPES[2],
      label: 'Autorizovaný dealer',
      description: 'Široké spektrum služieb pre konkrétnu značku vozidiel.',
      category: PROJECT_CATEGORIES.FULL_SERVICE,
    },
    [PROJECT_ORG_TYPES[3]]: { // 'tuning'
      key: PROJECT_ORG_TYPES[3],
      label: 'Tuning centrum',
      description: 'Úpravy výkonu a dizajnu vozidiel.',
      category: PROJECT_CATEGORIES.MECHANICAL,
    },
    [PROJECT_ORG_TYPES[4]]: { // 'wrapshop'
      key: PROJECT_ORG_TYPES[4],
      label: 'Wrap dielňa',
      description: 'Inštalácia fólií a polepov na vozidlá.',
      category: PROJECT_CATEGORIES.PAINT,
    },
    [PROJECT_ORG_TYPES[5]]: { // 'detailing'
      key: PROJECT_ORG_TYPES[5],
      label: 'Detailing centrum',
      description: 'Profesionálne čistenie a ochrana vozidiel.',
      category: PROJECT_CATEGORIES.PAINT,
    },
  } as Record<typeof PROJECT_ORG_TYPES[number], ProjectOrgTypeDetails>,

  // =================================================================
  //  SECTION 2: Universal platform configurations (Lakovna instance)
  // =================================================================

  accessRoleHierarchy: {
    [ACCESS_ROLES.SUPERADMIN]: 100,
    [ACCESS_ROLES.DEVELOPER]: 90,
    [ACCESS_ROLES.OWNER]: 80,
    [ACCESS_ROLES.MANAGER]: 60,
    [ACCESS_ROLES.COORDINATOR]: 50,
    [ACCESS_ROLES.WORKER]: 40,
    [ACCESS_ROLES.PARTNER]: 30,
    [ACCESS_ROLES.VIEWER]: 10,
  } as Record<typeof ACCESS_ROLES[number], number>,

  businessRoles: BUSINESS_ROLES_BASE,

  // =================================================================
  //  SECTION 3: Project defaults (configurable by owner in DB)
  // =================================================================

  defaultStageTemplates: STAGE_TEMPLATES,

  stagePipeline: STAGE_PIPELINE,

  defaultVehicles: DEFAULT_VEHICLES,

  // =================================================================
  //  SECTION 4: UI/App defaults
  // =================================================================
  
  routing: {
    homepage: {
      type: 'org_selector',
      defaultOrg: PROJECT_ORG_TYPES[0], // 'bodyshop'
    },
    paths: {
      [PROJECT_ORG_TYPES[0]]: '/',
      [PROJECT_ORG_TYPES[1]]: '/service',
      [PROJECT_ORG_TYPES[2]]: '/dealer',
      [PROJECT_ORG_TYPES[3]]: '/tuning',
      [PROJECT_ORG_TYPES[4]]: '/wrap',
      [PROJECT_ORG_TYPES[5]]: '/detailing',
    },
    cors: {
      allowedOrigins: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'https://autolakovna.online',
      ],
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
      exposedHeaders: ['Set-Cookie'],
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
} as const;