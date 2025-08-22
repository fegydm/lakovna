// common/types/worker.types.ts
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

export type WorkerRole = 'ADMIN' | 'MANAGER' | 'WORKER' | 'VIEWER';
export type AuthMethod = 'rfid' | 'qr' | 'usb' | 'password';