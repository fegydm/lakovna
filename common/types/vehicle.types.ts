// lakovna/common/types/vehicle.types.ts
export interface VehiclePosition {
  x: number;
  y: number;
}

export interface VehicleInfo {
  id: string;
  brand: string;
  model: string;
  registration: string;
  customer: {
    name: string;
    email?: string;
    phone?: string;
  };
  currentStage?: {
    id: number;
    name: string;
    icon: string;
  };
  status: VehicleStatus;
  position?: VehiclePosition;
  qrCode: string;
  trackingToken: string;
  entryTime: Date;
  estimatedCompletion?: Date;
}

export type VehicleStatus = 'WAITING' | 'MOVING' | 'DELAYED' | 'COMPLETED' | 'ON_HOLD';
