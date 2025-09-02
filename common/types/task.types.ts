// File: common/types/task.types.ts
// Last change: Corrected import flow to avoid circular dependencies and follow universal type export rule

import type { StageInfo } from './stage.types';
import type { VehicleInfo } from './vehicle.types';
import type { AuthUser } from './auth.types';
import type { TaskPriority } from './task-priority.types';

export const enum TaskProgressStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  ON_HOLD = 'on_hold',
}

export interface TaskInfo {
  id: string;
  title: string;
  description?: string;
  sequence: number;
  estimated_duration?: number;
  priority?: TaskPriority;
}

export interface TaskProgress {
  id: string;
  task: Pick<TaskInfo, 'id' | 'title' | 'sequence'>;
  stage: Pick<StageInfo, 'id' | 'name' | 'sequence'>;

  status: TaskProgressStatus;
  notes?: string;

  started_at?: Date;
  completed_at?: Date;

  vehicle_id?: string;
  vehicle?: Pick<VehicleInfo, 'id' | 'brand' | 'model' | 'registration_number'>;

  worker_id?: string;
  worker?: Pick<AuthUser, 'id' | 'name'>;
}