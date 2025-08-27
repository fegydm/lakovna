// File: sendeliver/front/src/libs/configs/paths.config.ts
// Last change: Created a central configuration for all application paths.

import { AppRole } from "../types/systems/app_role.types";

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
        settings: '/admin/settings',
    },
    roles: {
        sender: '/sender',
        hauler: '/hauler',
        broker: '/broker',
    },
};

export const getRolePath = (role: AppRole): string | undefined => {
    switch (role) {
        case 'sender':
            return APP_PATHS.roles.sender;
        case 'hauler':
            return APP_PATHS.roles.hauler;
        case 'broker':
            return APP_PATHS.roles.broker;
        default:
            return undefined;
    }
};

