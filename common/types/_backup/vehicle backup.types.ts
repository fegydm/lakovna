// File: common/types/vehicle.types.ts
// Last change: Updated types for consistency with project conventions

import type { StageInfo } from './stage.types';
import type { TaskProgressStatus } from './task.types';

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
  id: string;
  brand: string;
  model: string;
  registrationNumber: string;
  vin?: string;

  // Linked customer
  customer: VehicleCustomer;

  // Process / workflow stage
  currentStage?: StageInfo | null;
  currentStageId?: string | null;

  // Lifecycle status
  status: TaskProgressStatus;

  // Optional position
  position?: VehiclePosition;

  // Tracking + logistics
  qrCode?: string;
  trackingToken?: string;

  // Timing
  entryTime: Date;
  estimatedCompletion?: Date;
}