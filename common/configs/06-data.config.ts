// File: common/configs/06-data.config.ts
// Last change: Created consolidated data config and fixed runtime constant usage.

import { PROJECT_CATEGORIES, TASK_PRIORITIES, TASK_PROGRESS_STATUSES } from './01-constants.config';
import { PROJECT_COLOR_CONFIG } from './02-colors.config';
import type { HslColor, StageInfo, VehicleInfo } from '../types/project.types';

export const DATA_CONFIG = {
  stageTemplates: {
    [PROJECT_CATEGORIES.PAINT]: ['príjem', 'umývanie', 'príprava', 'lakovanie', 'dokončenie'],
    [PROJECT_CATEGORIES.MECHANICAL]: ['príjem', 'diagnostika', 'oprava', 'testovanie', 'odovzdanie'],
    [PROJECT_CATEGORIES.FULL_SERVICE]: ['príjem', 'hodnotenie', 'príprava', 'prezentácia', 'predaj'],
  },

  stagePipeline: [
    {
      id: 'cl1-1234',
      name: 'Príjem vozidla',
      icon: '🚗',
      colorHsl: PROJECT_COLOR_CONFIG.projectRoleColors.bodyshop as HslColor,
      sequence: 1,
      isActive: true,
      isRequired: true,
      organizationId: 'default-org-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      tasks: [
        {
          id: 'cl2-5678',
          title: 'Zaevidovať zákazku',
          sequence: 1,
          priority: TASK_PRIORITIES.HIGH,
          stageId: 'cl1-1234',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cl2-9101',
          title: 'Skontrolovať dokumenty',
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
      name: 'Lakovnícke práce',
      icon: '🎨',
      colorHsl: PROJECT_COLOR_CONFIG.projectRoleColors.bodyshop as HslColor,
      sequence: 2,
      isActive: true,
      isRequired: true,
      organizationId: 'default-org-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      tasks: [
        {
          id: 'cl2-5679',
          title: 'Príprava povrchu',
          sequence: 1,
          priority: TASK_PRIORITIES.HIGH,
          stageId: 'cl1-1235',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cl2-9102',
          title: 'Aplikácia farby',
          sequence: 2,
          priority: TASK_PRIORITIES.HIGH,
          stageId: 'cl1-1235',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cl2-1234',
          title: 'Sušenie',
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