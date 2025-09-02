// File: common/configs/auth.config.ts
// Last change: Consolidated all auth configurations into a single object and removed universal imports

import { AuthStatus } from '../types/auth.types';
import type { HslColor } from '../types/color.types';

export const AUTH_CONFIG = {
  status_labels: {
    [AuthStatus.ANONYMOUS]: 'Anonymous',
    [AuthStatus.COOKIES]: 'Temporary',
    [AuthStatus.REGISTERED]: 'Registered',
  } as Record<AuthStatus, string>,
  
  status_colors: {
    [AuthStatus.ANONYMOUS]: { h: 220, s: 10, l: 80 },
    [AuthStatus.COOKIES]: { h: 42, s: 94, l: 60 },
    [AuthStatus.REGISTERED]: { h: 140, s: 76, l: 40 },
  } as Record<AuthStatus, HslColor>,
  
  session_max_age_ms: 24 * 60 * 60 * 1000,
  
  is_authenticated: (status: AuthStatus): boolean =>
    status === AuthStatus.REGISTERED || status === AuthStatus.COOKIES,
};