// File: common/types/task.types.ts
// Shared task domain models – used across backend & frontend

import type { StageInfo } from './stage.types';
import type { VehicleInfo } from './vehicle.types';
import type { AuthUser } from './auth.types';

// ✅ Enum-like union pre statusy taskov
export type TaskProgressStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED'
  | 'ON_HOLD';

// Hlavné info o úlohe
export interface TaskInfo {
  id: string | number;
  title: string;
  description?: string;
  sequence: number;
  estimatedDuration?: number; // v minutach
}

// Záznam o priebehu tasku (viazaný na vozidlo)
export interface TaskProgress {
  id: string | number;
  task: Pick<TaskInfo, 'id' | 'title' | 'sequence'>;
  stage: Pick<StageInfo, 'id' | 'name' | 'sequence'>;

  status: TaskProgressStatus;
  notes?: string;

  startedAt?: Date;
  completedAt?: Date;

  // väzby
  vehicleId?: string;
  vehicle?: Pick<VehicleInfo, 'id' | 'brand' | 'model' | 'registration'>;

  workerId?: string;
  worker?: Pick<AuthUser, 'id' | 'name'>;
}
