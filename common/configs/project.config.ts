// File: common/configs/project.config.ts
// Project-specific configuration for Lakovňa

import type { ProjectOrgTypeDetails } from '../types/org-type.types';

export const PROJECT_CONFIG = {
  // Organization types (truth lives in ProjectOrgTypeDetails)
  orgTypes: [
    {
      key: 'bodyshop',
      label: 'Body Shop',
      description: 'Karoséria a lakovanie po havárii',
      category: 'paint',
    },
    {
      key: 'service',
      label: 'Auto Service',
      description: 'Komplexný servis osobných vozidiel',
      category: 'mechanical',
    },
    {
      key: 'dealer',
      label: 'Auto Dealer',
      description: 'Predaj a komplexný servis vozidiel',
      category: 'full-service',
    },
    {
      key: 'tuning',
      label: 'Performance Tuning',
      description: 'Výkonové úpravy a tuning',
      category: 'mechanical',
    },
    {
      key: 'wrapshop',
      label: 'Vehicle Wrap Shop',
      description: 'Aplikácia autofólií a car wrapping',
      category: 'paint',
    },
    {
      key: 'detailing',
      label: 'Detailing Studio',
      description: 'Detailing a starostlivosť o vozidlo',
      category: 'paint',
    },
  ] as const satisfies ProjectOrgTypeDetails[],

  // Routing
  routing: {
    homepage: {
      type: 'org-selector',
      defaultOrg: 'bodyshop',
    },
    paths: {
      bodyshop: '/',
      service: '/service',
      dealer: '/dealer',
      tuning: '/tuning',
      wrapshop: '/wrap',
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
