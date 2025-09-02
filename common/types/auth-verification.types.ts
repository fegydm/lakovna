// File: common/types/auth-verification.types.ts
// Last change: Updated types to use snake_case and be consistent with API response patterns

import type { AuthUser } from './auth.types';

export interface PendingVerificationInfo {
  email: string;
  expires_at: number; // epoch timestamp (ms)
}

export interface VerificationResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
  already_verified?: boolean;
}

export interface ResendResponse {
  success: boolean;
  expires_in?: number; // seconds until next resend allowed
  error?: string;
}

export interface VerifyCodeResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}