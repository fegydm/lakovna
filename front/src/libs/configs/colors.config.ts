// File: front/src/libs/configs/colors.config.ts
// Last change: Unified all color configurations using percentage-based system and APP_ROLE_MAP

import type { AppRole } from '../../../../common/types/app-role.types';
import { APP_ROLE_MAP } from '../../../../common/types/app-role.types';
import type { HslColor } from '../types/systems/theme.types';
import type { AuthStatus } from '../types/systems/auth_status.types';

// DOTS COLORS - Status colors (auth states)
export const DOTS_STATUS_COLORS: Record<AuthStatus | 'inactive', string> = {
  inactive: 'hsl(var(--color-gray-50))',
  anonymous: 'hsl(var(--color-red-60))',
  cookies: 'hsl(var(--color-orange-60))',
  registered: 'hsl(var(--color-green-60))',
};

// DOTS COLORS - Role colors (mapped through APP_ROLE_MAP)
export const DOTS_ROLE_COLORS: Record<string, string> = {
  client: 'hsl(var(--role-sender-60))',    // sender role color
  carrier: 'hsl(var(--role-hauler-60))',   // hauler role color  
  forwarder: 'hsl(var(--role-broker-60))', // broker role color
};

// PUBLIC/OBFUSCATED role mapping for CSS variables
export const CSS_ROLE_MAP = {
  hauler: 'crr',
  sender: 'cln',
  broker: 'frw'
} as const;

// SYSTEM-WIDE COLORS (environment colors, not role-specific)
export const SYSTEM_COLORS = {
  primary: { h: 0, s: 0, l: 50 },
  textPrimary: { h: 0, s: 0, l: 15 },
  textSecondary: { h: 0, s: 0, l: 45 },
  // Semantic colors - independent of role
  danger: { h: 0, s: 80, l: 55 },
  success: { h: 140, s: 80, l: 55 },
  warning: { h: 40, s: 80, l: 55 },
  // Base system colors
  gray: { h: 0, s: 0, l: 50 },
  red: { h: 0, s: 70, l: 50 },
  orange: { h: 30, s: 80, l: 55 },
  green: { h: 140, s: 70, l: 45 },
} as const;

// ROLE BRAND COLORS (simplified - direct HslColor for theme compatibility)
export const DEFAULT_ROLE_COLORS: Record<AppRole, HslColor> = {
  hauler: { h: 120, s: 40, l: 55 },
  sender: { h: 280, s: 60, l: 60 },
  broker: { h: 210, s: 50, l: 60 },
} as const;



// FUTURE: Multi-palette support (when needed)
export const ROLE_PALETTES: Record<AppRole, {
  main: HslColor;
  accent?: HslColor;
  support?: HslColor;
}> = {
  hauler: { main: { h: 110, s: 40, l: 55 } },
  sender: { main: { h: 280, s: 60, l: 60 } },
  broker: { main: { h: 210, s: 50, l: 60 } },
} as const;

// DEFAULT SEMANTIC LEVELS (0-100 percentage for lightness calculation)
export const DEFAULT_SEMANTIC_LEVELS = {
  background: 95,
  surface: 90,
  input: 85,
  border: 75,
  muted: 60,
  emphasis: 35,
  hover: 80,
  active: 30,
  subtle: 92,
  overlay: 88,
  accent: 25,
  light: 99,
} as const;

// Keep backward compatibility
export const SEMANTIC_LEVELS = DEFAULT_SEMANTIC_LEVELS;

// Helper types
export type SemanticLevel = keyof typeof DEFAULT_SEMANTIC_LEVELS;
export type SemanticLevelValue = number;

// Role-specific semantic level overrides (optional)
export const ROLE_SEMANTIC_OVERRIDES: Partial<Record<AppRole, Partial<Record<SemanticLevel, SemanticLevelValue>>>> = {
  sender: {
    emphasis: 40,
    muted: 55,
  },
  hauler: {
  },
  broker: {
    emphasis: 38,
    border: 70,
  }
};

// UTILITY FUNCTIONS FOR DOTS COLORS

export const getRoleColor = (role: AppRole): string => {
  const mappedRole = APP_ROLE_MAP[role];
  return DOTS_ROLE_COLORS[mappedRole] || DOTS_STATUS_COLORS.inactive;
};

export const getStatusColor = (status: AuthStatus): string => {
  return DOTS_STATUS_COLORS[status] || DOTS_STATUS_COLORS.inactive;
};

export const getDotColor = (id: string, isSelected: boolean, isRole: boolean = true): string => {
  if (!isSelected) return DOTS_STATUS_COLORS.inactive;
  
  if (isRole) {
    return DOTS_ROLE_COLORS[id] || DOTS_STATUS_COLORS.inactive;
  } else {
    return DOTS_STATUS_COLORS[id as AuthStatus] || DOTS_STATUS_COLORS.inactive;
  }
};

/**
 * Dynamic Semantic Levels Manager
 * Allows runtime modification of semantic levels
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
   * Adjust level for dark mode - updated to accept string parameter
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