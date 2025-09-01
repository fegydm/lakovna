// File: common/types/auth-verification.types.ts
// Contracts for email/code verification flows (FE + BE)

import type { AuthUser } from './auth.types';

export interface PendingVerificationInfo {
  email: string;
  expiresAt: number; // epoch timestamp (ms)
}

export interface VerificationResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
  alreadyVerified?: boolean;
}

export interface ResendResponse {
  success: boolean;
  expiresIn?: number; // seconds until next resend allowed
  error?: string;
}

export interface VerifyCodeResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}
