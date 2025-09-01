// File: common/utils/dot-colors.utils.ts
// Last change: Extracted semantic levels & dot color helpers into universal util

import type { UniversalAuthStatus } from 'common/types/universal/auth-status.types';
import type { ProjectOrgType } from 'common/types/project/org-type.types';
import type { HslColor } from 'common/types/shared/theme.types';

// DOTS COLORS - Status colors (auth states)
export const DOTS_STATUS_COLORS: Record<UniversalAuthStatus | 'inactive', string> = {
  inactive: 'hsl(var(--color-gray-50))',
  anonymous: 'hsl(var(--color-red-60))',
  cookies: 'hsl(var(--color-orange-60))',
  registered: 'hsl(var(--color-green-60))',
};

// DOTS COLORS - OrgType colors (project specific, mapped by CSS role map)
export const DOTS_ROLE_COLORS: Record<string, string> = {
  bodyshop: 'hsl(var(--role-bodyshop-60))',
  service: 'hsl(var(--role-service-60))',
  dealer: 'hsl(var(--role-dealer-60))',
  tuning: 'hsl(var(--role-tuning-60))',
  autofolie: 'hsl(var(--role-autofolie-60))',
};

// PUBLIC/OBFUSCATED role mapping for CSS variables
export const CSS_ROLE_MAP: Record<ProjectOrgType, string> = {
  bodyshop: 'bsh',
  service: 'srv',
  dealer: 'dlr',
  tuning: 'tun',
  autofolie: 'fol',
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

export type SemanticLevel = keyof typeof DEFAULT_SEMANTIC_LEVELS;
export type SemanticLevelValue = number;

// Role-specific semantic level overrides (optional, project specific)
export const ROLE_SEMANTIC_OVERRIDES: Partial<
  Record<ProjectOrgType, Partial<Record<SemanticLevel, SemanticLevelValue>>>
> = {
  bodyshop: { emphasis: 40, muted: 55 },
  service: {},
  dealer: { emphasis: 38, border: 70 },
  tuning: {},
  autofolie: {},
};

// Utility functions for dots

export const getRoleColor = (role: ProjectOrgType): string => {
  return DOTS_ROLE_COLORS[role] || DOTS_STATUS_COLORS.inactive;
};

export const getStatusColor = (status: UniversalAuthStatus): string => {
  return DOTS_STATUS_COLORS[status] || DOTS_STATUS_COLORS.inactive;
};

export const getDotColor = (
  id: string,
  isSelected: boolean,
  isRole: boolean = true
): string => {
  if (!isSelected) return DOTS_STATUS_COLORS.inactive;

  if (isRole) {
    return DOTS_ROLE_COLORS[id] || DOTS_STATUS_COLORS.inactive;
  } else {
    return DOTS_STATUS_COLORS[id as UniversalAuthStatus] || DOTS_STATUS_COLORS.inactive;
  }
};

/**
 * Dynamic Semantic Levels Manager
 * Allows runtime modification of semantic levels
 */
class SemanticLevelsManager {
  private userLevels: Map<string, Record<SemanticLevel, SemanticLevelValue>> = new Map();
  private roleLevels: Map<ProjectOrgType, Record<SemanticLevel, SemanticLevelValue>> = new Map();

  constructor() {
    this.resetToDefaults();
  }

  getLevels(role: ProjectOrgType, userId?: string): Record<SemanticLevel, SemanticLevelValue> {
    if (userId) {
      const userKey = `${userId}-${role}`;
      const userSpecific = this.userLevels.get(userKey);
      if (userSpecific) return userSpecific;
    }

    const roleSpecific = this.roleLevels.get(role);
    if (roleSpecific) return roleSpecific;

    return DEFAULT_SEMANTIC_LEVELS;
  }

  setUserLevels(userId: string, role: ProjectOrgType, levels: Partial<Record<SemanticLevel, SemanticLevelValue>>) {
    const key = `${userId}-${role}`;
    const current = this.getLevels(role, userId);
    this.userLevels.set(key, { ...current, ...levels });
  }

  setRoleLevels(role: ProjectOrgType, levels: Partial<Record<SemanticLevel, SemanticLevelValue>>) {
    const current = this.roleLevels.get(role) || DEFAULT_SEMANTIC_LEVELS;
    this.roleLevels.set(role, { ...current, ...levels });
  }

  resetToDefaults() {
    this.userLevels.clear();
    this.roleLevels.clear();

    Object.entries(ROLE_SEMANTIC_OVERRIDES).forEach(([role, overrides]) => {
      if (overrides) {
        this.roleLevels.set(role as ProjectOrgType, {
          ...DEFAULT_SEMANTIC_LEVELS,
          ...overrides,
        });
      }
    });
  }

  adjustForDarkMode(level: SemanticLevelValue, levelName: string): SemanticLevelValue {
    const noInvert: string[] = ['muted', 'emphasis'];
    if (noInvert.includes(levelName)) return level;
    return 100 - level;
  }
}

// Export singleton instance
export const semanticLevelsManager = new SemanticLevelsManager();
