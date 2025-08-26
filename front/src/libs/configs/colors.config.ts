// File: lakovna/front/src/libs/configs/colors.config.ts
// Last change: Workshop-specific colors with Sendeliver-compatible structure for universal utils

import type { AppRole } from '../types/systems/app_role.types';
import type { HslColor } from '../types/systems/theme.types';

// SYSTEM-WIDE COLORS (workshop environment colors, not role-specific)
export const SYSTEM_COLORS = {
  primary: { h: 213, s: 73, l: 47 },     // Workshop blue
  textPrimary: { h: 220, s: 13, l: 18 }, // Dark text
  textSecondary: { h: 220, s: 13, l: 46 }, // Medium text
  textTertiary: { h: 220, s: 13, l: 69 },  // Light text
  textInverse: { h: 0, s: 0, l: 100 },     // White text
  
  // Surface colors
  background: { h: 0, s: 0, l: 100 },      // Page background
  surface: { h: 220, s: 13, l: 98 },       // Cards, panels
  input: { h: 220, s: 13, l: 95 },         // Input fields
  border: { h: 220, s: 13, l: 91 },        // Borders
  borderHover: { h: 220, s: 13, l: 82 },   // Hover borders
  disabled: { h: 220, s: 13, l: 91 },      // Disabled elements
  
  // Semantic colors - independent of role
  danger: { h: 0, s: 84, l: 60 },
  success: { h: 142, s: 71, l: 45 },
  warning: { h: 38, s: 92, l: 50 },
  info: { h: 199, s: 89, l: 48 },
} as const;

// WORKSHOP ROLE COLORS (hierarchy-based)
export const DEFAULT_ROLE_COLORS: Record<AppRole, HslColor> = {
  admin: { h: 0, s: 84, l: 60 },      // Red - authority/danger
  manager: { h: 213, s: 73, l: 47 },  // Blue - leadership/primary
  worker: { h: 142, s: 71, l: 45 },   // Green - productive/success
  viewer: { h: 220, s: 13, l: 69 },   // Gray - neutral/readonly
} as const;

// WORKSHOP-SPECIFIC COLORS
export const WORKSHOP_COLORS = {
  // Stage states
  stageWaiting: { h: 38, s: 92, l: 50 },   // Orange - waiting for action
  stageActive: { h: 213, s: 73, l: 47 },   // Blue - in progress
  stageCompleted: { h: 142, s: 71, l: 45 }, // Green - finished
  stageDelayed: { h: 0, s: 84, l: 60 },     // Red - problem/delayed
  
  // Vehicle types (for demo/visualization)
  vehicleBmw: { h: 213, s: 73, l: 47 },     // Blue
  vehicleAudi: { h: 0, s: 84, l: 60 },      // Red
  vehicleMercedes: { h: 220, s: 13, l: 46 }, // Gray
  vehicleVolkswagen: { h: 142, s: 71, l: 45 }, // Green
  vehicleFord: { h: 38, s: 92, l: 50 },     // Orange
  
  // Task priorities
  priorityLow: { h: 220, s: 13, l: 69 },    // Gray
  priorityMedium: { h: 38, s: 92, l: 50 },  // Orange
  priorityHigh: { h: 0, s: 84, l: 60 },     // Red
  priorityUrgent: { h: 340, s: 82, l: 52 }, // Magenta
} as const;

// DEFAULT SEMANTIC LEVELS (0-100 percentage for lightness calculation)
export const DEFAULT_SEMANTIC_LEVELS = {
  background: 98,    // Page background (lightest)
  surface: 95,       // Cards, panels
  input: 92,         // Input fields, textarea
  border: 88,        // Borders, dividers
  borderHover: 82,   // Hover borders
  muted: 69,         // Inactive text, icons
  emphasis: 47,      // Buttons, emphasis
  hover: 37,         // Hover states
  active: 27,        // Active/pressed states
  disabled: 91,      // Disabled elements
  subtle: 96,        // Very subtle backgrounds
  overlay: 90,       // Modal overlays
  accent: 35,        // Strong accent color
  light: 99,         // Lightest background
} as const;

// Keep backward compatibility
export const SEMANTIC_LEVELS = DEFAULT_SEMANTIC_LEVELS;

// Helper types
export type SemanticLevel = keyof typeof DEFAULT_SEMANTIC_LEVELS;
export type SemanticLevelValue = number;

// Role-specific semantic level overrides (optional)
export const ROLE_SEMANTIC_OVERRIDES: Partial<Record<AppRole, Partial<Record<SemanticLevel, SemanticLevelValue>>>> = {
  admin: {
    // Red needs adjustments for better contrast
    emphasis: 50,     // Slightly lighter red
    hover: 40,        // Better hover visibility
  },
  manager: {
    // Blue works well with defaults
  },
  worker: {
    // Green might need slight adjustments
    emphasis: 45,
    hover: 35,
  },
  viewer: {
    // Gray needs higher contrast
    emphasis: 46,
    muted: 60,
  }
};

/**
 * Dynamic Semantic Levels Manager
 * Allows runtime modification of semantic levels for workshop customization
 */
class SemanticLevelsManager {
  private userLevels: Map<string, Record<SemanticLevel, SemanticLevelValue>> = new Map();
  private roleLevels: Map<AppRole, Record<SemanticLevel, SemanticLevelValue>> = new Map();
  
  constructor() {
    this.resetToDefaults();
  }
  
  /**
   * Get semantic levels for a specific role and user
   */
  getLevels(role: AppRole, userId?: string): Record<SemanticLevel, SemanticLevelValue> {
    if (userId) {
      const userKey = `${userId}-${role}`;
      const userSpecific = this.userLevels.get(userKey);
      if (userSpecific) return userSpecific;
    }
    
    const roleSpecific = this.roleLevels.get(role);
    if (roleSpecific) return roleSpecific;
    
    return DEFAULT_SEMANTIC_LEVELS;
  }
  
  /**
   * Set semantic levels for a specific user and role
   */
  setUserLevels(userId: string, role: AppRole, levels: Partial<Record<SemanticLevel, SemanticLevelValue>>) {
    const key = `${userId}-${role}`;
    const current = this.getLevels(role, userId);
    this.userLevels.set(key, {
      ...current,
      ...levels
    });
  }
  
  /**
   * Set semantic levels for a role (affects all users)
   */
  setRoleLevels(role: AppRole, levels: Partial<Record<SemanticLevel, SemanticLevelValue>>) {
    const current = this.roleLevels.get(role) || DEFAULT_SEMANTIC_LEVELS;
    this.roleLevels.set(role, {
      ...current,
      ...levels
    });
  }
  
  /**
   * Reset to default configuration
   */
  resetToDefaults() {
    this.userLevels.clear();
    this.roleLevels.clear();
    
    Object.entries(ROLE_SEMANTIC_OVERRIDES).forEach(([role, overrides]) => {
      if (overrides) {
        this.roleLevels.set(role as AppRole, {
          ...DEFAULT_SEMANTIC_LEVELS,
          ...overrides
        });
      }
    });
  }
  
  /**
   * Adjust level for dark mode - compatible with universal color utils
   */
  adjustForDarkMode(level: SemanticLevelValue, levelName: string): SemanticLevelValue {
    const noInvert: string[] = ['muted', 'emphasis'];
    
    if (noInvert.includes(levelName)) {
      return level;
    }
    
    return 100 - level;
  }
}

// Export singleton instance
export const semanticLevelsManager = new SemanticLevelsManager();