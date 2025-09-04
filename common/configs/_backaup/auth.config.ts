// File: common/configs/auth.config.ts
// Last change: Updated enum keys to match the new PascalCase convention.

import { AuthStatus } from '../types/auth backup.types';
import type { HslColor } from '../../types/color.types';

export const AUTH_CONFIG = {
  status_labels: {
    [AuthStatus.Anonymous]: 'Anonymous',
    [AuthStatus.Cookies]: 'Temporary',
    [AuthStatus.Registered]: 'Registered',
  } as Record<AuthStatus, string>,

  status_colors: {
    [AuthStatus.Anonymous]: { h: 220, s: 10, l: 80 },
    [AuthStatus.Cookies]: { h: 42, s: 94, l: 60 },
    [AuthStatus.Registered]: { h: 140, s: 76, l: 40 },
  } as Record<AuthStatus, HslColor>,

  session_max_age_ms: 24 * 60 * 60 * 1000,

  session_cookie_name: 'session_id',

  is_authenticated: (status: AuthStatus): boolean =>
    status === AuthStatus.Registered || status === AuthStatus.Cookies,
};
