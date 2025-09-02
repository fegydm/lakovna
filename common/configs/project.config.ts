// File: common/configs/project.config.ts
// Last change: Corrected cors configuration and fixed type casting issues

import type { ProjectOrgTypeDetails } from '../types/organization.types';
import { ProjectCategory } from '../types/project-category.types';
import { AccessRole } from '../types/access-role.types';
import type { BusinessRole } from '../types/business-role.types';
import type { DotCategoryConfig } from '../types/dot-system.types';
import type { HslColor } from '../types/color.types';
import { PROJECT_COLOR_CONFIG } from './project-colors.config';
import { TaskProgressStatus } from '../types/task.types';
import type { VehicleInfo } from '../types/vehicle.types';

export const PROJECT_CONFIG = {
  // =================================================================
  //  SECTION 1: Project-specific Mappings
  // =================================================================

  dot_category_ui: {
    [ProjectCategory.PAINT]: {
      label: 'Karoséria & Vizuál',
      description: 'Zamerané na vizuálne úpravy a lakovanie vozidiel.',
      color: PROJECT_COLOR_CONFIG.project_role_colors.bodyshop as HslColor,
      icon: '🎨',
    },
    [ProjectCategory.MECHANICAL]: {
      label: 'Mechanika & Servis',
      description: 'Komplexná diagnostika a oprava mechanických častí.',
      color: PROJECT_COLOR_CONFIG.project_role_colors.service as HslColor,
      icon: '🔧',
    },
    [ProjectCategory.FULL_SERVICE]: {
      label: 'Komplexné služby',
      description: 'Poskytuje kompletné služby od laku až po motor.',
      color: PROJECT_COLOR_CONFIG.project_role_colors.dealer as HslColor,
      icon: '🏪',
    },
  } as Record<ProjectCategory, DotCategoryConfig>,

  platform_category_mappings: {
    [ProjectCategory.PAINT]: 'A',
    [ProjectCategory.MECHANICAL]: 'B',
    [ProjectCategory.FULL_SERVICE]: 'AB',
  },

  organization_type_mappings: {
    'bodyshop': {
      key: 'bodyshop',
      label: 'Karosárska dielňa',
      description: 'Špecializácia na opravy karosérií a lakovanie.',
      category: ProjectCategory.PAINT,
    },
    'service': {
      key: 'service',
      label: 'Autoservis',
      description: 'Opravy a údržba motorov a mechanických komponentov.',
      category: ProjectCategory.MECHANICAL,
    },
    'dealer': {
      key: 'dealer',
      label: 'Autorizovaný dealer',
      description: 'Široké spektrum služieb pre konkrétnu značku vozidiel.',
      category: ProjectCategory.FULL_SERVICE,
    },
    'tuning': {
      key: 'tuning',
      label: 'Tuning centrum',
      description: 'Úpravy výkonu a dizajnu vozidiel.',
      category: ProjectCategory.MECHANICAL,
    },
    'wrapshop': {
      key: 'wrapshop',
      label: 'Wrap dielňa',
      description: 'Inštalácia fólií a polepov na vozidlá.',
      category: ProjectCategory.PAINT,
    },
    'detailing': {
      key: 'detailing',
      label: 'Detailing centrum',
      description: 'Profesionálne čistenie a ochrana vozidiel.',
      category: ProjectCategory.PAINT,
    },
  } as const,

  // =================================================================
  //  SECTION 2: Universal platform configurations (Lakovna instance)
  // =================================================================

  access_role_hierarchy: {
    [AccessRole.SUPERADMIN]: 100,
    [AccessRole.DEVELOPER]: 90,
    [AccessRole.OWNER]: 80,
    [AccessRole.MANAGER]: 60,
    [AccessRole.COORDINATOR]: 50,
    [AccessRole.WORKER]: 40,
    [AccessRole.PARTNER]: 30,
    [AccessRole.VIEWER]: 10,
  } as Record<AccessRole, number>,

  business_roles: [
    'shop_owner',
    'painter',
    'service_tech',
    'advisor',
    'estimator',
    'detailer',
    'wrapper',
  ] as const satisfies ReadonlyArray<BusinessRole>,

  // =================================================================
  //  SECTION 3: Project defaults (configurable by owner in DB)
  // =================================================================

  default_stage_templates: {
    [ProjectCategory.PAINT]: ['príjem', 'umývanie', 'príprava', 'lakovanie', 'dokončenie'],
    [ProjectCategory.MECHANICAL]: ['príjem', 'diagnostika', 'oprava', 'testovanie', 'odovzdanie'],
    [ProjectCategory.FULL_SERVICE]: ['príjem', 'hodnotenie', 'príprava', 'prezentácia', 'predaj'],
  } as Record<ProjectCategory, string[]>,

  stage_pipeline: [
    {
      id: 'cl1-1234',
      name: 'Príjem vozidla',
      icon: '🚗',
      color: PROJECT_COLOR_CONFIG.project_role_colors.bodyshop as HslColor,
      sequence: 1,
      is_active: true,
      is_required: true,
      tasks: [
        {
          id: 'cl2-5678',
          title: 'Zaevidovať zákazku',
          sequence: 1,
          priority: 'HIGH',
        },
        {
          id: 'cl2-9101',
          title: 'Skontrolovať dokumenty',
          sequence: 2,
          priority: 'MEDIUM',
        },
      ],
    },
    {
      id: 'cl1-1235',
      name: 'Lakovnícke práce',
      icon: '🎨',
      color: PROJECT_COLOR_CONFIG.project_role_colors.bodyshop as HslColor,
      sequence: 2,
      is_active: true,
      is_required: true,
      tasks: [
        {
          id: 'cl2-5679',
          title: 'Príprava povrchu',
          sequence: 1,
          priority: 'HIGH',
        },
        {
          id: 'cl2-9102',
          title: 'Aplikácia farby',
          sequence: 2,
          priority: 'HIGH',
        },
        {
          id: 'cl2-1234',
          title: 'Sušenie',
          sequence: 3,
          priority: 'LOW',
        },
      ],
    },
    {
      id: 'cl1-1236',
      name: 'Odovzdanie zákazky',
      icon: '✅',
      color: PROJECT_COLOR_CONFIG.project_role_colors.bodyshop as HslColor,
      sequence: 3,
      is_active: true,
      is_required: true,
      tasks: [
        {
          id: 'cl2-5680',
          title: 'Kontrola kvality',
          sequence: 1,
          priority: 'CRITICAL',
        },
        {
          id: 'cl2-9103',
          title: 'Odovzdanie vozidla klientovi',
          sequence: 2,
          priority: 'HIGH',
        },
      ],
    },
  ],
  
  default_vehicles: [
    {
      id: 'cl1-1234',
      brand: 'Škoda',
      model: 'Octavia',
      registration_number: 'BA-123XY',
      customer: {
        name: 'Jozef Mrkvička',
        email: 'jozef@example.com',
        phone: '+421900111222',
      },
      current_stage: null,
      status: TaskProgressStatus.PENDING,
      position: { x: 10, y: 20 },
      qr_code: 'QR-001',
      tracking_token: 'TRACK-001',
      entry_time: new Date(),
    },
    {
      id: 'cl1-1235',
      brand: 'Volkswagen',
      model: 'Passat',
      registration_number: 'KE-987AB',
      customer: {
        name: 'Mária Horváthová',
        email: 'maria@example.com',
      },
      current_stage: null,
      status: TaskProgressStatus.IN_PROGRESS,
      position: { x: 40, y: 60 },
      qr_code: 'QR-002',
      tracking_token: 'TRACK-002',
      entry_time: new Date(),
      estimated_completion: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
    {
      id: 'cl1-1236',
      brand: 'BMW',
      model: 'X5',
      registration_number: 'TN-555CC',
      customer: {
        name: 'Peter Novák',
        phone: '+421944333444',
      },
      current_stage: null,
      status: TaskProgressStatus.COMPLETED,
      qr_code: 'QR-003',
      tracking_token: 'TRACK-003',
      entry_time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      estimated_completion: new Date(Date.now() - 1000 * 60 * 60 * 5),
    },
  ] as ReadonlyArray<VehicleInfo>,

  // =================================================================
  //  SECTION 4: UI/App defaults
  // =================================================================
  
  routing: {
    homepage: {
      type: 'org_selector',
      default_org: 'bodyshop',
    },
    paths: {
      bodyshop: '/',
      service: '/service',
      dealer: '/dealer',
      tuning: '/tuning',
      wrapshop: '/wrap',
      detailing: '/detailing',
    },
    cors: {
      allowed_origins: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'https://autolakovna.online',
      ],
      allowed_methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowed_headers: ['Content-Type', 'Authorization', 'X-API-Key'],
      exposed_headers: ['Set-Cookie'],
    },
  },

  branding: {
    colors: {
      primary: PROJECT_COLOR_CONFIG.project_role_colors.bodyshop as HslColor,
      secondary: PROJECT_COLOR_CONFIG.project_role_colors.service as HslColor,
      accent: PROJECT_COLOR_CONFIG.project_role_colors.dealer as HslColor,
    },
    logo: {
      text: '🏭 Lakovňa',
      icon: '🏭',
    },
    theme: 'light',
  },
} as const;

export type ProjectConfig = typeof PROJECT_CONFIG;