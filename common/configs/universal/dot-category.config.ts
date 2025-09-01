// File: common/configs/universal/dot-category.config.ts
// Last change: Renamed from platform-dots to project-dots for clarity
// Defines universal 3+3 dots system (A/B/AB + auth status)

// Row 1: Universal project categories (always A/B/AB)
export type UniversalProjectDotCategory = 'A' | 'B' | 'AB';

export interface UniversalProjectDot {
  label: string;
  description: string;
  color: string;
  icon: string;
}

export const UNIVERSAL_PROJECT_DOTS: Record<UniversalProjectDotCategory, UniversalProjectDot> = {
  A: {
    label: 'Category A',
    description: 'First primary category',
    color: '#2563eb', // default blue
    icon: '🔵',
  },
  B: {
    label: 'Category B',
    description: 'Second primary category',
    color: '#f59e0b', // default orange
    icon: '🟠',
  },
  AB: {
    label: 'Category AB',
    description: 'Hybrid category (A+B)',
    color: '#10b981', // default green
    icon: '🟢',
  },
};

// Row 2: Universal authentication / status (always 3 states)
export type UniversalAuthStatus = 'anonymous' | 'cookies' | 'registered';

export interface UniversalAuthStatusConfig {
  label: string;
  description: string;
  color: string;
  icon: string;
}

export const UNIVERSAL_AUTH_STATUSES: Record<UniversalAuthStatus, UniversalAuthStatusConfig> = {
  anonymous: {
    label: 'Anonymous',
    description: 'Not logged in, guest user',
    color: '#9ca3af',
    icon: '👤',
  },
  cookies: {
    label: 'Cookies',
    description: 'Session via cookies',
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
