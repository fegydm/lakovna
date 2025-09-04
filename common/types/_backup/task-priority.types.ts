// File: common/types/task-priority.types.ts
// Last change: Refactored from enum to type and aligned with naming conventions.

import { TASK_PRIORITIES } from '../configs/task-priority.config';

export type TaskPriority = (typeof TASK_PRIORITIES)[number];