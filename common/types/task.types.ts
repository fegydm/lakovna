// File: common/types/task.types.ts
// Shared task domain models – unified with Prisma enums

import type { StageInfo } from './stage.types';
import type { VehicleInfo } from './vehicle.types';
import type { AuthUser } from './auth.types';
import { TaskStatus } from '@prisma/client'; // ✅ Prisma enum je pravda

// Záznam o úlohe (task definition)
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

  status: TaskStatus; // ✅ enum z Prisma
  notes?: string;

  startedAt?: Date;
  completedAt?: Date;

  // väzby
  vehicleId?: string;
  vehicle?: Pick<VehicleInfo, 'id' | 'brand' | 'model' | 'registration'>;

  workerId?: string;
  worker?: Pick<AuthUser, 'id' | 'name'>;
}
