// File: common/types/stage.types.ts
// Shared stage/task domain models – used in workflow systems

// Task priority levels
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// Task status states
export type TaskStatus =
  | 'TODO'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'SKIPPED'
  | 'DELAYED';

// Task within a stage
export interface StageTaskInfo {
  id: number | string;
  title: string;
  description?: string;
  sequence: number;
  priority: TaskPriority;
  estimatedDuration?: number; // minutes/hours, depends on project
  status?: TaskStatus;
}

// Stage in a workflow
export interface StageInfo {
  id: number | string;
  name: string;
  icon?: string;
  color?: string;
  position?: { x: number; y: number }; // optional for visual layout
  sequence: number;
  isActive: boolean;
  isRequired: boolean;
  tasks: StageTaskInfo[];
}
