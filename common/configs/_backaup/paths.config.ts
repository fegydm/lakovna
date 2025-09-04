// File: common/configs/paths.config.ts
// Last change: Consolidated all paths and helpers into a single object and applied camelCase naming

import type { DotCategoryKey } from '../types/dot-system.types';
import { PROJECT_CATEGORIES } from './project-category.config'; 

export const APP_PATHS = {
  authPaths: {
    login: '/login',
    register: '/register',
    logout: '/logout',
    verifyEmail: '/verify-email',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    profile: '/profile',
  },
  publicPaths: {
    home: '/',
    about: '/about',
    contact: '/contact',
    cookiePolicy: '/cookie-policy',
    privacyPolicy: '/privacy-policy',
  },
  portalPaths: {
    dashboard: '/dashboard',
    settings: '/settings',
    appearance: '/settings/appearance',
    organization: '/organization',
    team: '/team',
  },
  adminPaths: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    organizations: '/admin/organizations',
    settings: '/admin/settings',
  },
  categoryPaths: {
    [PROJECT_CATEGORIES.PAINT]: '/paint',
    [PROJECT_CATEGORIES.MECHANICAL]: '/mechanical',
    [PROJECT_CATEGORIES.FULL_SERVICE]: '/full-service',
  } as Record<DotCategoryKey, string>,
};

export const getCategoryPath = (category: DotCategoryKey): string => {
  return APP_PATHS.categoryPaths[category];
};

export const getCategoryDashboard = (category: DotCategoryKey): string => {
  return `${APP_PATHS.categoryPaths[category]}/dashboard`;
};

export const getCategoryWorkflow = (category: DotCategoryKey): string => {
  return `${APP_PATHS.categoryPaths[category]}/workflow`;
};

export const PROTECTED_PATHS = [
  ...Object.values(APP_PATHS.portalPaths),
  ...Object.values(APP_PATHS.adminPaths),
  ...Object.values(APP_PATHS.categoryPaths),
];

export const PUBLIC_PATHS = [
  ...Object.values(APP_PATHS.publicPaths),
  APP_PATHS.authPaths.login,
  APP_PATHS.authPaths.register,
  APP_PATHS.authPaths.forgotPassword,
];

export const ADMIN_PATHS = Object.values(APP_PATHS.adminPaths);