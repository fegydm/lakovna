// File: common/configs/ui.config.ts
// Static design constants (developer-only, rarely changed)

export const DESIGN_CONSTANTS = {
  // Typography (brand consistency)
  typography: {
    fontSizeBase: 16, // Base font size in px
    lineHeightBase: 1.5,
    fontWeightNormal: 400,
    fontWeightBold: 600,
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  // Layout (design system consistency)
  layout: {
    borderRadius: 8, // Default radius
    borderRadiusSmall: 6,
    borderRadiusLarge: 12,
  },

  // Spacing scale (grid system)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Animation (performance tuned)
  animation: {
    durationFast: 150,
    durationNormal: 300,
    durationSlow: 500,
    easingDefault: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Technical constants (persisted keys, system-level)
  technical: {
    storageKeys: {
      userRoleColors: 'userRoleColors',
      themeMode: 'themeMode',
      lastDbSync: 'themeLastDbSync',
      pendingChanges: 'themePendingChanges',
    },
  },
} as const;
