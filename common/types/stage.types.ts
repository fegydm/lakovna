// File: common/types/stage.types.ts
// Last change: Updated types for consistency with HslColor and snake_case naming

import type { TaskProgressStatus } from './task.types';
import type { HslColor } from './color.types';
import type { TaskPriority } from './task-priority.types';

// Task within a stage
export interface StageTaskInfo {
  id: string;
  title: string;
  description?: string;
  sequence: number;
  priority: TaskPriority;
  estimated_duration?: number;
  status?: TaskProgressStatus;
}

// Stage in a workflow
export interface StageInfo {
  id: string;
  name: string;
  icon?: string;
  color?: HslColor;
  position?: { x: number; y: number };
  sequence: number;
  is_active: boolean;
  is_required: boolean;
  tasks: StageTaskInfo[];
}