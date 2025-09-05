// File: common/types/dashboard.types.ts
// Last change: Updated imports after atomizing project.types.ts.

// ZMENA: Importujeme už len potrebné typy z ich nových, špecifických súborov.
import type { TaskProgressStatus } from './vehicle.types';
import type { HslColor } from './ui.types';

export interface StageVehicleCount {
  id: string;
  name: string;
  sequence: number;
  vehicleCount: number;
  icon?: string;
  colorHsl?: HslColor | null;
}

export interface CompletedVehicleTime {
  entryTime: Date;
  updatedAt: Date;
}

export interface RecentTaskActivity {
  id: string;
  status: TaskProgressStatus;
  notes?: string;
  startedAt?: Date;
  completedAt?: Date;
  task: {
    id: string;
    title: string;
    sequence: number;
  };
  stage: {
    id: string;
    name: string;
    sequence: number;
  };
  vehicle?: {
    id: string;
    brand: string;
    model: string;
    registrationNumber: string;
  };
  worker?: {
    id: string;
    name: string;
  };
}

export interface DelayedVehicleInfo {
  brand: string;
  model: string;
  registrationNumber: string;
  estimatedCompletion: Date | null;
  customerName: string;
  currentStageName: string | null;
}

export interface StuckTaskInfo {
  id: string;
  status: TaskProgressStatus;
  startedAt: Date | null;
  taskTitle: string;
  vehicleInfo?: string;
  workerName?: string;
}