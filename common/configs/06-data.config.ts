// File: common/configs/06-data.config.ts
// Last change: Replaced hardcoded UI text with translation keys and fixed SSoT constant usage.

import { PROJECT_CATEGORIES, PROJECT_ORG_TYPES, TASK_PRIORITIES, TASK_PROGRESS_STATUSES } from './01-constants.config';
import { PROJECT_COLOR_CONFIG } from './02-colors.config';

import type { HslColor } from '../types/ui.types';
import type { StageInfo, VehicleInfo } from '../types/vehicle.types';

export const DATA_CONFIG = {
  // ZMENA: Namiesto textov pre UI tu máme prekladové kľúče.
  stageTemplates: {
    [PROJECT_CATEGORIES.PAINT]: ['stage_name_intake', 'stage_name_washing', 'stage_name_preparation', 'stage_name_painting', 'stage_name_completion'],
    [PROJECT_CATEGORIES.MECHANICAL]: ['stage_name_intake', 'stage_name_diagnostics', 'stage_name_repair', 'stage_name_testing', 'stage_name_handover'],
    [PROJECT_CATEGORIES.FULL_SERVICE]: ['stage_name_intake', 'stage_name_evaluation', 'stage_name_preparation', 'stage_name_presentation', 'stage_name_sale'],
  },

  stagePipeline: [
    {
      id: 'cl1-1234',
      name: 'stage_name_vehicle_intake', // ZMENA: Prekladový kľúč
      icon: '🚗',
      // OPRAVA: Používame konštantu s hranatými zátvorkami
      colorHsl: PROJECT_COLOR_CONFIG.projectRoleColors[PROJECT_ORG_TYPES.BODYSHOP] as HslColor,
      sequence: 1,
      isActive: true,
      isRequired: true,
      organizationId: 'default-org-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      tasks: [
        {
          id: 'cl2-5678',
          title: 'task_title_register_order', // ZMENA: Prekladový kľúč
          sequence: 1,
          priority: TASK_PRIORITIES.HIGH,
          stageId: 'cl1-1234',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cl2-9101',
          title: 'task_title_check_documents', // ZMENA: Prekladový kľúč
          sequence: 2,
          priority: TASK_PRIORITIES.MEDIUM,
          stageId: 'cl1-1234',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
    {
      id: 'cl1-1235',
      name: 'stage_name_painting_works', // ZMENA: Prekladový kľúč
      icon: '🎨',
      // OPRAVA: Používame konštantu s hranatými zátvorkami
      colorHsl: PROJECT_COLOR_CONFIG.projectRoleColors[PROJECT_ORG_TYPES.BODYSHOP] as HslColor,
      sequence: 2,
      isActive: true,
      isRequired: true,
      organizationId: 'default-org-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      tasks: [
        {
          id: 'cl2-5679',
          title: 'task_title_surface_prep', // ZMENA: Prekladový kľúč
          sequence: 1,
          priority: TASK_PRIORITIES.HIGH,
          stageId: 'cl1-1235',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cl2-9102',
          title: 'task_title_paint_application', // ZMENA: Prekladový kľúč
          sequence: 2,
          priority: TASK_PRIORITIES.HIGH,
          stageId: 'cl1-1235',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cl2-1234',
          title: 'task_title_drying', // ZMENA: Prekladový kľúč
          sequence: 3,
          priority: TASK_PRIORITIES.LOW,
          stageId: 'cl1-1235',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
  ] as const satisfies readonly StageInfo[],

  defaultVehicles: [
    {
      id: 'cl1-1234',
      brand: 'Škoda',
      model: 'Octavia',
      registrationNumber: 'BA-123XY',
      customer: {
        name: 'Jozef Mrkvička',
        email: 'jozef@example.com',
        phone: '+421900111222',
      },
      currentStage: null,
      currentStageId: null,
      status: TASK_PROGRESS_STATUSES.PENDING,
      position: { x: 10, y: 20 },
      qrCode: 'QR-001',
      trackingToken: 'TRACK-001',
      entryTime: new Date(),
    },
    {
      id: 'cl1-1235',
      brand: 'Volkswagen',
      model: 'Passat',
      registrationNumber: 'KE-987AB',
      customer: {
        name: 'Mária Horváthová',
        email: 'maria@example.com',
      },
      currentStage: null,
      currentStageId: null,
      status: TASK_PROGRESS_STATUSES.IN_PROGRESS,
      position: { x: 40, y: 60 },
      qrCode: 'QR-002',
      trackingToken: 'TRACK-002',
      entryTime: new Date(),
      estimatedCompletion: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  ] as const satisfies readonly VehicleInfo[],
};