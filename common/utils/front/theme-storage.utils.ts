// File: common/utils/front/theme-storage.utils.ts
// Last change: Extracted storage-related theme utilities from project-theme.config.ts and Sendeliver theme.config.ts

import type { HslColor } from '../../types/theme.types';
import type { ProjectOrgType } from '../../types/organization.types';
import type { ThemeMode } from '../../types/theme-mode.types';
import { PROJECT_ROLE_COLORS } from '../../configs/project-colors.config';
import { DESIGN_CONSTANTS } from '../../configs/ui.config';

const STORAGE_KEYS = DESIGN_CONSTANTS.technical.storageKeys;

/**
 * Parse raw JSON from localStorage into role colors.
 */
const parseStoredRoleColors = (
  raw: string | null
): Partial<Record<ProjectOrgType, HslColor>> => {
  if (!raw) return {};
  try {
    const obj = JSON.parse(raw) as unknown;
    return (obj ?? {}) as Partial<Record<ProjectOrgType, HslColor>>;
  } catch {
    return {};
  }
};

/**
 * Get user-defined role color, fallback to defaults.
 */
export const getUserRoleColor = async (
  role: ProjectOrgType,
  userId?: string,
  colorType: 'main' | 'accent' | 'neutral' = 'main'
): Promise<HslColor> => {
  if (userId) {
    try {
      // TODO: DB lookup (future)
    } catch (error) {
      console.warn(
        `[ThemeStorage] Failed to fetch theme from DB for user ${userId}:`,
        error
      );
    }
  }

  if (colorType !== 'main') {
    console.warn(
      `[ThemeStorage] ${colorType} colors not yet implemented, using main color`
    );
  }

  return PROJECT_ROLE_COLORS[role];
};

/**
 * Save user role color to localStorage (and queue DB sync if userId provided).
 */
export const saveUserRoleColor = async (
  role: ProjectOrgType,
  color: HslColor,
  userId?: string,
  colorType: 'main' | 'accent' | 'neutral' = 'main'
): Promise<void> => {
  if (colorType !== 'main') {
    console.warn(`[ThemeStorage] Only main color supported currently`);
    return;
  }

  try {
    const storageKey = STORAGE_KEYS.userRoleColors;
    const userColors = JSON.parse(localStorage.getItem(storageKey) || '{}');
    userColors[role] = color;
    localStorage.setItem(storageKey, JSON.stringify(userColors));
  } catch (error) {
    console.error('[ThemeStorage] Failed to save color to localStorage:', error);
  }

  if (userId) {
    try {
      const pending = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.pendingChanges) || '{}'
      );
      pending[`${role}-${colorType}`] = { color, timestamp: Date.now() };
      localStorage.setItem(
        STORAGE_KEYS.pendingChanges,
        JSON.stringify(pending)
      );
    } catch (error) {
      console.warn(`[ThemeStorage] Failed to queue DB sync:`, error);
    }
  }
};

/**
 * Get theme mode from localStorage, fallback to light.
 */
export const getThemeMode = (): ThemeMode => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.themeMode);
    return (saved as ThemeMode) || 'light';
  } catch {
    return 'light';
  }
};

/**
 * Save theme mode to localStorage.
 */
export const saveThemeMode = (mode: ThemeMode): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.themeMode, mode);
  } catch (error) {
    console.error('[ThemeStorage] Failed to save theme mode:', error);
  }
};
