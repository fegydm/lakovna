// File: common/configs/auth.config.ts
// Runtime configuration for AuthStatus (labels, colors, helpers)

import type { AuthStatus } from '../types/auth.types';

export const AUTH_STATUS_LABELS: Record<AuthStatus, string> = {
  anonymous: 'Anonymous',
  cookies: 'Cookies',
  registered: 'Registered',
};

export const AUTH_STATUS_COLORS: Record<AuthStatus, string> = {
  anonymous: '#9ca3af',  // gray
  cookies: '#f59e0b',    // amber
  registered: '#10b981', // green
};

// Helper to check if status is authenticated
export const isAuthenticated = (status: AuthStatus): boolean =>
  status === 'registered';
