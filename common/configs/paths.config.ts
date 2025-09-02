// File: common/configs/paths.config.ts
// Last change: Consolidated all paths and helpers into a single object and applied snake_case naming

import type { DotCategory } from '../types/dot-system.types';

export const APP_PATHS = {
  auth_paths: {
    login: '/login',
    register: '/register',
    logout: '/logout',
    verify_email: '/verify-email',
    forgot_password: '/forgot-password',
    reset_password: '/reset-password',
    profile: '/profile',
  },
  public_paths: {
    home: '/',
    about: '/about',
    contact: '/contact',
    cookie_policy: '/cookie-policy',
    privacy_policy: '/privacy-policy',
  },
  portal_paths: {
    dashboard: '/dashboard',
    settings: '/settings',
    appearance: '/settings/appearance',
    organization: '/organization',
    team: '/team',
  },
  admin_paths: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    organizations: '/admin/organizations',
    settings: '/admin/settings',
  },
  category_paths: {
    paint: '/paint',
    mechanical: '/mechanical',
    full_service: '/full-service',
  } as Record<DotCategory, string>,
};

export const get_category_path = (category: DotCategory): string => {
  return APP_PATHS.category_paths[category];
};

export const get_category_dashboard = (category: DotCategory): string => {
  return `${APP_PATHS.category_paths[category]}/dashboard`;
};

export const get_category_workflow = (category: DotCategory): string => {
  return `${APP_PATHS.category_paths[category]}/workflow`;
};

export const PROTECTED_PATHS = [
  ...Object.values(APP_PATHS.portal_paths),
  ...Object.values(APP_PATHS.admin_paths),
  ...Object.values(APP_PATHS.category_paths),
];

export const PUBLIC_PATHS = [
  ...Object.values(APP_PATHS.public_paths),
  APP_PATHS.auth_paths.login,
  APP_PATHS.auth_paths.register,
  APP_PATHS.auth_paths.forgot_password,
];

export const ADMIN_PATHS = Object.values(APP_PATHS.admin_paths);