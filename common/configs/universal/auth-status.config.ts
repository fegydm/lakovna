// File: common/configs/universal/auth-status.config.ts
// Runtime configuration for UniversalAuthStatus (labels, colors, helpers)

import type { UniversalAuthStatus } from '../../types/universal/auth-status.types';

export const AUTH_STATUS_LABELS: Record<UniversalAuthStatus, string> = {
  anonymous: 'Anonymous',
  cookies: 'Cookies',
  registered: 'Registered',
};

export const AUTH_STATUS_COLORS: Record<UniversalAuthStatus, string> = {
  anonymous: '#9ca3af', // gray
  cookies: '#f59e0b',   // amber
  registered: '#10b981', // green
};

// Helper to check if status is authenticated
export const isAuthenticated = (status: UniversalAuthStatus): boolean =>
  status === 'registered';
