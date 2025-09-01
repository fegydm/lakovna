// File: common/configs/dot-system.config.ts
// Defines dot system: categories (row 1) + statuses (row 2)

import type {
  DotCategory,
  DotCategoryConfig,
  DotStatus,
  DotStatusConfig,
} from '../types/dot-system.types';

// Row 1: Categories (paint / mechanical / full-service)
export const DOT_CATEGORIES: Record<DotCategory, DotCategoryConfig> = {
  paint: {
    label: 'Paint',
    description: 'Organizations focused mainly on painting services',
    color: '#2563eb',
    icon: '🎨',
  },
  mechanical: {
    label: 'Mechanical',
    description: 'Organizations focused mainly on mechanical services',
    color: '#f59e0b',
    icon: '🔧',
  },
  'full-service': {
    label: 'Full Service',
    description: 'Organizations offering both painting and mechanical services',
    color: '#10b981',
    icon: '⚙️',
  },
};

// Row 2: Authentication / status
export const DOT_STATUSES: Record<DotStatus, DotStatusConfig> = {
  anonymous: {
    label: 'Anonymous',
    description: 'User without authentication (guest)',
    color: '#9ca3af',
    icon: '👤',
  },
  cookies: {
    label: 'Session',
    description: 'Authenticated via cookies/session',
    color: '#fbbf24',
    icon: '🍪',
  },
  registered: {
    label: 'Registered',
    description: 'Fully authenticated user',
    color: '#10b981',
    icon: '✅',
  },
};
