// File: common/configs/project/project.config.ts
// Project-specific configuration for Lakovňa

import type { UniversalDotCategory } from '../../types/universal/dot-category.types';
import type { UniversalAuthStatus } from '../../types/universal/auth-status.types';
import type { ProjectDotCategory } from '../../types/project/dot-category.types';
import type { ProjectOrgType } from '../../types/project/org-type.types';

export const PROJECT_CONFIG = {
  // Organization types
  orgTypes: {
    labels: {
      bodyshop: 'Body Shop',
      service: 'Auto Service',
      dealer: 'Auto Dealer',
      tuning: 'Performance Tuning',
      'wrap-shop': 'Vehicle Wrap Shop',
      detailing: 'Detailing Studio',
    },
    descriptions: {
      bodyshop: 'Karoséria a lakovanie po havárii',
      service: 'Komplexný servis osobných vozidiel',
      dealer: 'Predaj a komplexný servis vozidiel',
      tuning: 'Výkonové úpravy a tuning',
      'wrap-shop': 'Aplikácia autofólií a car wrapping',
      detailing: 'Detailing a starostlivosť o vozidlo',
    },
  },

  // Mapping org types to dot categories
  projectDots: {
    mapping: {
      bodyshop: {
        universalCategory: 'A' as UniversalDotCategory,
        projectCategory: 'paint' as ProjectDotCategory,
        canAlsoAccess: ['mechanical'],
      },
      service: {
        universalCategory: 'B' as UniversalDotCategory,
        projectCategory: 'mechanical' as ProjectDotCategory,
        canAlsoAccess: ['paint'],
      },
      dealer: {
        universalCategory: 'AB' as UniversalDotCategory,
        projectCategory: 'full-service' as ProjectDotCategory,
        canAlsoAccess: ['paint', 'mechanical'],
      },
      tuning: {
        universalCategory: 'B' as UniversalDotCategory,
        projectCategory: 'mechanical' as ProjectDotCategory,
        canAlsoAccess: ['paint'],
      },
      'wrap-shop': {
        universalCategory: 'A' as UniversalDotCategory,
        projectCategory: 'paint' as ProjectDotCategory,
        canAlsoAccess: [],
      },
      detailing: {
        universalCategory: 'A' as UniversalDotCategory,
        projectCategory: 'paint' as ProjectDotCategory,
        canAlsoAccess: [],
      },
    },

    // Auth statuses (Row 2 dots)
    authRow: {
      anonymous: {
        label: 'Hosť',
        description: 'Používateľ bez prihlásenia',
      },
      cookies: {
        label: 'Session',
        description: 'Prihlásený cez cookies/session',
      },
      registered: {
        label: 'Registrovaný',
        description: 'Plne autentifikovaný používateľ',
      },
    } as Record<UniversalAuthStatus, { label: string; description: string }>,
  },

  // Routing
  routing: {
    homepage: {
      type: 'org-selector',
      defaultOrg: 'bodyshop' as ProjectOrgType,
    },
    paths: {
      bodyshop: '/',
      service: '/service',
      dealer: '/dealer',
      tuning: '/tuning',
      'wrap-shop': '/wrap',
      detailing: '/detailing',
    },
  },

  // Branding
  branding: {
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#059669',
    },
    logo: {
      text: '🏭 Lakovňa',
      icon: '🏭',
    },
    theme: 'light',
  },
} as const;

export type ProjectConfig = typeof PROJECT_CONFIG;
