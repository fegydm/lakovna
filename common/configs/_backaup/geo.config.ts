// File: common/configs/geo.config.ts
// Last change: Consolidated configuration into a single object and applied snake_case naming

export const GEO_CONFIG = {
  // Priority for logistics sorting (lower = higher priority)
  country_priority: {
    SK: 1,
    CZ: 2,
    DE: 3,
    // ... extend as needed
  } as Record<string, number>,

  // Mapping ISO2 → flag asset path
  country_flags: {
    SK: '/flags/4x3/sk.svg',
    CZ: '/flags/4x3/cz.svg',
    DE: '/flags/4x3/de.svg',
    // ... extend as needed
  } as Record<string, string>,

  // Default values
  default_country_priority: 99,
  default_flag_path: '/flags/4x3/unknown.svg',
};