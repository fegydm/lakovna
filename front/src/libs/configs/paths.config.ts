// File: front/src/libs/configs/paths.config.ts
// Last change: Adapted from Sendeliver for Lakovna with workshop-specific paths

import { AppRole } from "../../../../common/types/app-role.types";

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
    },
    admin: {
        dashboard: '/admin/dashboard',
        users: '/admin/users',
        organizations: '/admin/organizations',
        settings: '/admin/settings',
        system: '/admin/system',
    },
    roles: {
        service: '/service',
        bodyshop: '/bodyshop',
        dealer: '/dealer',
    },
    workshop: {
        vehicles: '/workshop/vehicles',
        stages: '/workshop/stages',
        team: '/workshop/team',
        reports: '/workshop/reports',
    },
};

export const getRolePath = (role: AppRole): string | undefined => {
    switch (role) {
        case 'service':
            return APP_PATHS.roles.service;
        case 'bodyshop':
            return APP_PATHS.roles.bodyshop;
        case 'dealer':
            return APP_PATHS.roles.dealer;
        default:
            return undefined;
    }
};

export const getWorkshopPath = (section: keyof typeof APP_PATHS.workshop): string => {
    return APP_PATHS.workshop[section];
};