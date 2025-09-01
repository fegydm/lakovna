// File: common/types/vehicle.types.ts
// Shared vehicle domain models – used across projects (Lakovňa, Sendeliver, ...)

import type { StageInfo } from './stage.types';

// Vehicle lifecycle statuses
export type VehicleStatus =
  | 'WAITING'
  | 'MOVING'
  | 'DELAYED'
  | 'COMPLETED'
  | 'ON_HOLD';

// Vehicle geo/position info (local or GPS-based)
export interface VehiclePosition {
  x: number;
  y: number;
}

// Linked customer info
export interface VehicleCustomer {
  name: string;
  email?: string;
  phone?: string;
}

// Vehicle main info
export interface VehicleInfo {
  id: string | number;
  brand: string;
  model: string;
  registration: string;

  // Linked customer
  customer: VehicleCustomer;

  // Process / workflow stage
  currentStage?: StageInfo;

  // Lifecycle status
  status: VehicleStatus;

  // Optional position
  position?: VehiclePosition;

  // Tracking + logistics
  qrCode?: string;
  trackingToken?: string;

  // Timing
  entryTime: Date;
  estimatedCompletion?: Date;
}
