// File: common/configs/universal/ui.config.ts
// Last change: Static design constants that developers change rarely

// STATIC DESIGN CONSTANTS (developer-only, rarely changed)
export const DESIGN_CONSTANTS = {
  // Typography (static - brand consistency)
  typography: {
    fontSizeBase: 16,        // Base font size in px
    lineHeightBase: 1.5,     // Base line height  
    fontWeightNormal: 400,   // Normal font weight
    fontWeightBold: 600,     // Bold font weight
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  
  // Layout (static - design system consistency)
  layout: {
    borderRadius: 8,         // Default border radius in px
    borderRadiusSmall: 6,    // Small elements
    borderRadiusLarge: 12,   // Large elements
  },
  
  // Spacing scale (static - design system grid)
  spacing: {
    xs: 4,    // 4px
    sm: 8,    // 8px  
    md: 16,   // 16px
    lg: 24,   // 24px
    xl: 32,   // 32px
    xxl: 48,  // 48px
  },
  
  // Animation (static - performance optimized)
  animation: {
    durationFast: 150,       // Fast transitions in ms
    durationNormal: 300,     // Normal transitions in ms  
    durationSlow: 500,       // Slow transitions in ms
    easingDefault: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Technical constants (never change)
  technical: {
    storageKeys: {
      userRoleColors: 'userRoleColors',
      themeMode: 'themeMode', 
      lastDbSync: 'themeLastDbSync',
      pendingChanges: 'themePendingChanges',
    },
  },
} as const;

// Helper types
export type DesignConstant = keyof typeof DESIGN_CONSTANTS;