// File: common/configs/universal/paths.config.ts
// Last change: Migrated from AppRole to UniversalDotCategory system

import { UniversalDotCategory } from '../../types/universal/dot-category.types';

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
        A: '/category-a',
        B: '/category-b',
        AB: '/category-ab',
    },
};

export const getCategoryPath = (category: UniversalDotCategory): string => {
    return APP_PATHS.categories[category];
};

export const getCategoryDashboard = (category: UniversalDotCategory): string => {
    return `${APP_PATHS.categories[category]}/dashboard`;
};

export const getCategoryWorkflow = (category: UniversalDotCategory): string => {
    return `${APP_PATHS.categories[category]}/workflow`;
};

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