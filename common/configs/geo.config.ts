// File: common/configs/geo.config.ts
// Runtime configs for geo domain models

// Priority for logistics sorting (lower = higher priority)
export const COUNTRY_PRIORITY_CONFIG: Record<string, number> = {
  SK: 1,
  CZ: 2,
  DE: 3,
  // ... extend as needed
};

// Mapping ISO2 → flag asset path
export const COUNTRY_FLAG_CONFIG: Record<string, string> = {
  SK: '/flags/4x3/sk.svg',
  CZ: '/flags/4x3/cz.svg',
  DE: '/flags/4x3/de.svg',
  // ... extend as needed
};

// Default values
export const DEFAULT_COUNTRY_PRIORITY = 99;
export const DEFAULT_FLAG_PATH = '/flags/4x3/unknown.svg';
