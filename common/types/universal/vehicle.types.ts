// File: common/types/universal/vehicle.types.ts
// Last change: Decoupled from Prisma, universal independent Vehicle types

export type VehicleStatus = 
  | 'WAITING'
  | 'MOVING'
  | 'DELAYED'
  | 'COMPLETED'
  | 'ON_HOLD';

export interface VehiclePosition {
  x: number;
  y: number;
}

export interface VehicleCustomer {
  name: string;
  email?: string;
  phone?: string;
}

export interface VehicleStage {
  id: number;
  name: string;
  icon: string;
}

export interface VehicleInfo {
  id: string;
  brand: string;
  model: string;
  registration: string;
  customer: VehicleCustomer;
  currentStage?: VehicleStage;
  status: VehicleStatus;
  position?: VehiclePosition;
  qrCode: string;
  trackingToken: string;
  entryTime: Date;
  estimatedCompletion?: Date;
}
