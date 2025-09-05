// File: common/types/vehicle.types.ts
// Last change: Added Payloads and DTOs for the vehicle bridge layer.
// Contains all types related to the core business domain: vehicles, stages, and tasks.

import {
  TASK_PRIORITIES,
  TASK_PROGRESS_STATUSES,
} from '../configs/01-constants.config';
import type { AuthUser } from './auth.types';
import type { HslColor } from './ui.types';

export interface StageInfo {
  id: string;
  /** Programmatic, non-translatable, unique key for the stage (e.g., "intake", "completed"). */
  key: string; 
  /** Translation key for the user-facing name (e.g., "stage_name_intake"). */
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

export interface StageTaskInfo {
  id: string;
  /** Translation key for the user-facing title (e.g., "task_title_check_documents"). */
  title: string;
  description?: string | null;
  sequence: number;
  priority: TaskPriority | null;
  estimatedDuration?: number | null;
  status?: TaskProgressStatus;
  stageId: string;
  createdAt: Date;
  updatedAt: Date;
}

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

export interface VehiclePosition {
  x: number;
  y: number;
}

export interface VehicleCustomer {
  name: string;
  email?: string;
  phone?: string;
}

export interface VehicleInfo {
  id: string;
  brand: string;
  model: string;
  registrationNumber: string;
    vin?: string | null;
  customer: VehicleCustomer;
  currentStage?: StageInfo | null;
  currentStageId?: string | null;
  status: TaskProgressStatus;
  position?: VehiclePosition;
  qrCode?: string;
  trackingToken?: string;
  entryTime: Date;
  estimatedCompletion?: Date | null;
}

// =====================================================================
// PRIDANÉ: Payloads & DTOs pre Bridge vrstvu
// =====================================================================

/** Defines the shape of data for creating a new vehicle. */
export interface CreateVehiclePayload {
  organizationId: string;
  brand: string;
  model: string;
  registrationNumber: string;
  vin?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  entryTime?: Date;
  estimatedCompletion?: Date;
  currentStageId?: string;
}

/** Defines the shape of data for updating an existing vehicle. */
export interface UpdateVehiclePayload {
  brand?: string;
  model?: string;
  registrationNumber?: string;
  vin?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  entryTime?: Date;
  estimatedCompletion?: Date;
  currentStageId?: string;
}

/** Defines the specific, lean data object for the public vehicle tracking page. */
export interface VehicleTrackingDTO {
  brand: string;
  model: string;
  registrationNumber: string;
  entryTime: Date;
  estimatedCompletion: Date | null;
  currentStage: {
    name: string;
    sequence: number;
  } | null;
  tasks: {
    title: string;
    sequence: number;
  }[];
}

// =====================================================================
// Odvodené typy
// =====================================================================

export type TaskProgressStatus =
  typeof TASK_PROGRESS_STATUSES[keyof typeof TASK_PROGRESS_STATUSES];
export type TaskPriority = typeof TASK_PRIORITIES[keyof typeof TASK_PRIORITIES];