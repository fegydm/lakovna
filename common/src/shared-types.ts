// common/src/shared-types.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Vehicle types (shared between front/back)
export interface VehiclePosition {
  x: number;
  y: number;
}

export type VehicleStatus = 'WAITING' | 'MOVING' | 'DELAYED' | 'COMPLETED' | 'ON_HOLD';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED' | 'DELAYED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type WorkerRole = 'ADMIN' | 'MANAGER' | 'WORKER' | 'VIEWER';
export type AuthMethod = 'rfid' | 'qr' | 'usb' | 'password';