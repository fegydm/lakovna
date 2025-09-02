// File: common/types/vehicle.types.ts
// Last change: Updated current_stage to accept null type for consistency

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
  registration_number: string;
  vin?: string;

  // Linked customer
  customer: VehicleCustomer;

  // Process / workflow stage
  current_stage?: StageInfo | null;
  current_stage_id?: string | null;

  // Lifecycle status
  status: TaskProgressStatus;

  // Optional position
  position?: VehiclePosition;

  // Tracking + logistics
  qr_code?: string;
  tracking_token?: string;

  // Timing
  entry_time: Date;
  estimated_completion?: Date;
}