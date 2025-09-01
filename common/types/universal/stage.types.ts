// File: common/types/universal/stage.types.ts
// Last change: Converted StageInfo to universal data structure, removed fixed project-specific definitions

export interface StageInfo {
  id: number;
  name: string;
  icon: string;
  color: string;
  position: {
    x: number;
    y: number;
  };
  sequence: number;
  isActive: boolean;
  isRequired: boolean;
  tasks: StageTaskInfo[];
}

export interface StageTaskInfo {
  id: number;
  title: string;
  description: string;
  sequence: number;
  priority: TaskPriority;
  estimatedDuration: number;
}

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED' | 'DELAYED';
