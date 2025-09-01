// File: common/configs/paths.config.ts
// Central routing paths for app (auth, public, portal, admin, categories)

import type { DotCategory } from '../types/dot-system.types';

export const APP_PATHS = {
  auth: {
    login: '/login',
    register: '/register',
    logout: '/logout',
    verifyEmail: '/verify-email',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    profile: '/profile',
  },
  public: {
    home: '/',
    about: '/about',
    contact: '/contact',
    cookiePolicy: '/cookie-policy',
    privacyPolicy: '/privacy-policy',
  },
  portal: {
    dashboard: '/dashboard',
    settings: '/settings',
    appearance: '/settings/appearance',
    organization: '/organization',
    team: '/team',
  },
  admin: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    organizations: '/admin/organizations',
    settings: '/admin/settings',
  },
  categories: {
    paint: '/paint',
    mechanical: '/mechanical',
    'full-service': '/full-service',
  } as Record<DotCategory, string>,
};

// --- Helpers
export const getCategoryPath = (category: DotCategory): string => {
  return APP_PATHS.categories[category];
};

export const getCategoryDashboard = (category: DotCategory): string => {
  return `${APP_PATHS.categories[category]}/dashboard`;
};

export const getCategoryWorkflow = (category: DotCategory): string => {
  return `${APP_PATHS.categories[category]}/workflow`;
};

// --- Protected/public/admin sets
export const PROTECTED_PATHS = [
  APP_PATHS.portal.dashboard,
  APP_PATHS.portal.settings,
  APP_PATHS.portal.organization,
  APP_PATHS.portal.team,
  APP_PATHS.admin.dashboard,
  APP_PATHS.admin.users,
  APP_PATHS.admin.organizations,
  APP_PATHS.admin.settings,
  ...Object.values(APP_PATHS.categories),
];

export const PUBLIC_PATHS = [
  APP_PATHS.public.home,
  APP_PATHS.public.about,
  APP_PATHS.public.contact,
  APP_PATHS.public.cookiePolicy,
  APP_PATHS.public.privacyPolicy,
  APP_PATHS.auth.login,
  APP_PATHS.auth.register,
  APP_PATHS.auth.forgotPassword,
];

export const ADMIN_PATHS = [
  APP_PATHS.admin.dashboard,
  APP_PATHS.admin.users,
  APP_PATHS.admin.organizations,
  APP_PATHS.admin.settings,
];
