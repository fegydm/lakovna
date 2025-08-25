// File: lakovna/common/types/worker.types.ts

export const WorkerRole = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER', 
  WORKER: 'WORKER',
  VIEWER: 'VIEWER'
} as const;

export type WorkerRole = typeof WorkerRole[keyof typeof WorkerRole];

export const AuthMethod = {
  RFID: 'rfid',
  QR: 'qr', 
  USB: 'usb',
  PASSWORD: 'password'
} as const;

export type AuthMethod = typeof AuthMethod[keyof typeof AuthMethod];

export interface WorkerInfo {
  id: string;
  name: string;
  email: string;
  role: WorkerRole;
  isActive: boolean;
  authMethods: {
    rfid?: string;
    qr?: string;
    usb?: string;
  };
}