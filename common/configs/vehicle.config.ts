// File: common/configs/vehicle.config.ts
// Default mock vehicles for Lakovňa project

import type { VehicleInfo } from '../types/vehicle.types';
import { DEFAULT_STAGES } from './stage.config';

export const DEFAULT_VEHICLES: VehicleInfo[] = [
  {
    id: 1,
    brand: 'Škoda',
    model: 'Octavia',
    registration: 'BA-123XY',
    customer: {
      name: 'Jozef Mrkvička',
      email: 'jozef@example.com',
      phone: '+421900111222',
    },
    currentStage: DEFAULT_STAGES[0], // Príjem vozidla
    status: 'WAITING',
    position: { x: 10, y: 20 },
    qrCode: 'QR-001',
    trackingToken: 'TRACK-001',
    entryTime: new Date(),
  },
  {
    id: 2,
    brand: 'Volkswagen',
    model: 'Passat',
    registration: 'KE-987AB',
    customer: {
      name: 'Mária Horváthová',
      email: 'maria@example.com',
    },
    currentStage: DEFAULT_STAGES[1], // Lakovnícke práce
    status: 'MOVING',
    position: { x: 40, y: 60 },
    qrCode: 'QR-002',
    trackingToken: 'TRACK-002',
    entryTime: new Date(),
    estimatedCompletion: new Date(Date.now() + 1000 * 60 * 60 * 24), // +1 day
  },
  {
    id: 3,
    brand: 'BMW',
    model: 'X5',
    registration: 'TN-555CC',
    customer: {
      name: 'Peter Novák',
      phone: '+421944333444',
    },
    currentStage: DEFAULT_STAGES[2], // Odovzdanie zákazky
    status: 'COMPLETED',
    qrCode: 'QR-003',
    trackingToken: 'TRACK-003',
    entryTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // pred 2 dňami
    estimatedCompletion: new Date(Date.now() - 1000 * 60 * 60 * 5), // pred 5 h
  },
] as const;
