// File: common/configs/project-defaults.config.ts
// Last change: Moved complex default configurations here to simplify project.config.ts.

import type { HslColor } from '../../types/color.types';
import { PROJECT_CATEGORIES } from './project-category.config.ts';
import { TaskProgressStatus } from '../types/task.types';
import { PROJECT_COLOR_CONFIG } from '../project-colors.config';

export const STAGE_TEMPLATES = {
  [PROJECT_CATEGORIES.PAINT]: ['príjem', 'umývanie', 'príprava', 'lakovanie', 'dokončenie'],
  [PROJECT_CATEGORIES.MECHANICAL]: ['príjem', 'diagnostika', 'oprava', 'testovanie', 'odovzdanie'],
  [PROJECT_CATEGORIES.FULL_SERVICE]: ['príjem', 'hodnotenie', 'príprava', 'prezentácia', 'predaj'],
} as const;

export const STAGE_PIPELINE = [
  {
    id: 'cl1-1234',
    name: 'Príjem vozidla',
    icon: '🚗',
    color: PROJECT_COLOR_CONFIG.projectRoleColors.bodyshop as HslColor,
    sequence: 1,
    isActive: true,
    isRequired: true,
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
    color: PROJECT_COLOR_CONFIG.projectRoleColors.bodyshop as HslColor,
    sequence: 2,
    isActive: true,
    isRequired: true,
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
    color: PROJECT_COLOR_CONFIG.projectRoleColors.bodyshop as HslColor,
    sequence: 3,
    isActive: true,
    isRequired: true,
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
] as const;

export const DEFAULT_VEHICLES = [
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
    status: TaskProgressStatus.PENDING,
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
    status: TaskProgressStatus.IN_PROGRESS,
    position: { x: 40, y: 60 },
    qrCode: 'QR-002',
    trackingToken: 'TRACK-002',
    entryTime: new Date(),
    estimatedCompletion: new Date(Date.now() + 1000 * 60 * 60 * 24),
  },
  {
    id: 'cl1-1236',
    brand: 'BMW',
    model: 'X5',
    registrationNumber: 'TN-555CC',
    customer: {
      name: 'Peter Novák',
      phone: '+421944333444',
    },
    currentStage: null,
    status: TaskProgressStatus.COMPLETED,
    qrCode: 'QR-003',
    trackingToken: 'TRACK-003',
    entryTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    estimatedCompletion: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
] as const;