// File: common/types/task.types.ts
// Last change: Aligned all types with camelCase and removed runtime enums.

import type { StageInfo } from './stage.types';
import type { VehicleInfo } from './vehicle backup.types';
import type { AuthUser } from './auth backup.types';
import type { TaskPriority } from './task-priority.types';
import { TASK_PRIORITIES } from '../configs/task.config'; // Importing the runtime array

export type TaskProgressStatus = typeof TASK_PROGRESS_STATUSES[number];

export interface TaskInfo {
  id: string;
  title: string;
  description?: string;
  sequence: number;
  estimatedDuration?: number;
  priority?: TaskPriority;
}

export interface TaskProgress {
  id: string;
  task: Pick<TaskInfo, 'id' | 'title' | 'sequence'>;
  stage: Pick<StageInfo, 'id' | 'name' | 'sequence'>;

  status: TaskProgressStatus;
  notes?: string;

  startedAt?: Date;
  completedAt?: Date;

  vehicleId?: string;
  vehicle?: Pick<VehicleInfo, 'id' | 'brand' | 'model' | 'registrationNumber'>;

  workerId?: string;
  worker?: Pick<AuthUser, 'id' | 'name'>;
}