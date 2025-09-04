// File: common/configs/task.config.ts
// Last change: Created a single source of truth for all task statuses.

export const TASK_PROGRESS_STATUSES = [
  'pending',
  'in_progress',
  'completed',
  'failed',
  'on_hold',
] as const;

export const TASK_PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;