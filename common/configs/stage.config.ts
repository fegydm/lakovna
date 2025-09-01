// File: common/configs/stage.config.ts
// Default workflow stages (example: Lakovňa pipeline)

import type { StageInfo } from '../types/stage.types';

export const DEFAULT_STAGES: StageInfo[] = [
  {
    id: 1,
    name: 'Príjem vozidla',
    icon: '🚗',
    color: '#2563eb',
    sequence: 1,
    isActive: true,
    isRequired: true,
    tasks: [
      {
        id: 101,
        title: 'Zaevidovať zákazku',
        sequence: 1,
        priority: 'HIGH',
      },
      {
        id: 102,
        title: 'Skontrolovať dokumenty',
        sequence: 2,
        priority: 'MEDIUM',
      },
    ],
  },
  {
    id: 2,
    name: 'Lakovnícke práce',
    icon: '🎨',
    color: '#f59e0b',
    sequence: 2,
    isActive: true,
    isRequired: true,
    tasks: [
      {
        id: 201,
        title: 'Príprava povrchu',
        sequence: 1,
        priority: 'HIGH',
      },
      {
        id: 202,
        title: 'Aplikácia farby',
        sequence: 2,
        priority: 'HIGH',
      },
      {
        id: 203,
        title: 'Sušenie',
        sequence: 3,
        priority: 'LOW',
      },
    ],
  },
  {
    id: 3,
    name: 'Odovzdanie zákazky',
    icon: '✅',
    color: '#10b981',
    sequence: 3,
    isActive: true,
    isRequired: true,
    tasks: [
      {
        id: 301,
        title: 'Kontrola kvality',
        sequence: 1,
        priority: 'CRITICAL',
      },
      {
        id: 302,
        title: 'Odovzdanie vozidla klientovi',
        sequence: 2,
        priority: 'HIGH',
      },
    ],
  },
] as const;
