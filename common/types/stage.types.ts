// File: common/types/stage.types.ts

import type { StageInfo } from './vehicle.types';
import type { HslColor } from './ui.types';
import type { VehicleInfo } from './vehicle.types';

// Payloads (vstupné dáta pre bridge funkcie)
export interface CreateStagePayload {
  name: string;
  sequence: number;
  organizationId: string;
  icon?: string;
  colorHsl?: HslColor | null;
  isActive?: boolean;
  isRequired?: boolean;
}

export interface UpdateStagePayload {
  name?: string;
  icon?: string;
  colorHsl?: HslColor | null;
  sequence?: number;
  isActive?: boolean;
  isRequired?: boolean;
}

// DTOs (výstupné dáta z bridge funkcií)
export type StageDTO = StageInfo;

export interface StageDetailsDTO extends StageDTO {
  vehiclesInStage: Pick<VehicleInfo, 'id' | 'brand' | 'model' | 'registrationNumber'>[];
}

export interface StageWithVehicleCheckDTO {
  stage: StageDTO;
  hasVehicles: boolean;
  vehicleCount: number;
}