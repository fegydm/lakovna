import type { AuthUser } from './auth-user.types';

export interface PendingVerificationInfo {
  email: string;
  expiresAt: number;
}

export interface VerificationResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
  alreadyVerified?: boolean;
}

export interface ResendResponse {
  ok: boolean;
  expiresIn?: number;
  error?: string;
}

export interface VerifyCodeResponse {
  ok: boolean;
  user?: AuthUser;
  error?: string;
}
