// File: common/types/stage.types.ts
// Last change: Aligned with Prisma schema - using color_hsl and HslColor type

import type { TaskProgressStatus } from './task.types';
import type { HslColor } from './color.types';
import type { TaskPriority } from './task-priority.types';

export interface StageTaskInfo {
  id: string;
  title: string;
  description?: string | null;
  sequence: number;
  priority: TaskPriority;
  estimatedDuration?: number | null;
  status?: TaskProgressStatus;
  stageId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StageInfo {
  id: string;
  name: string;
  icon?: string | null;
  colorHsl?: HslColor | null;
  positionX?: number | null;
  positionY?: number | null;
  sequence: number;
  isActive: boolean;
  isRequired: boolean;
  organizationId: string;
  tasks: StageTaskInfo[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StageWithVehicleCount extends StageInfo {
  vehicleCount?: number;
}

export interface StageBasic {
  id: string;
  name: string;
  icon?: string | null;
  colorHsl?: HslColor | null;
  sequence: number;
  isActive: boolean;
}