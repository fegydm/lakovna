// File: sendeliver/front/src/libs/configs/theme.config.ts
// Last change: Corrected imports to use relative paths as per project rules

import type { HslColor, ThemeSettings } from '../types/systems/theme.types';
import type { AppRole } from '../types/systems/app_role.types';
import type { ThemeMode } from '../types/systems/theme_mode.types';
import { DEFAULT_ROLE_COLORS } from './colors.config';
import { DESIGN_CONSTANTS } from './ui.config';

const parseStoredRoleColors = (raw: string | null): Partial<Record<AppRole, HslColor>> => {
  if (!raw) return {};
  try {
    const obj = JSON.parse(raw) as unknown;
    return (obj ?? {}) as Partial<Record<AppRole, HslColor>>;
  } catch {
    return {};
  }
};

export const DEFAULT_THEME_SETTINGS: Omit<ThemeSettings, 'primaryColor' | 'secondaryColor' | 'mode'> = {
  typography: DESIGN_CONSTANTS.typography,
  layout: DESIGN_CONSTANTS.layout,
};

const STORAGE_KEYS = DESIGN_CONSTANTS.technical.storageKeys;

export const getUserRoleColor = async (
  role: AppRole,
  userId?: string,
  colorType: 'main' | 'accent' | 'neutral' = 'main'
): Promise<HslColor> => {
  if (userId) {
    try {
      // TODO: DB lookup (future)
    } catch (error) {
      console.warn(`[ThemeConfig] Failed to fetch theme from DB for user ${userId}:`, error);
    }
  }

  if (colorType !== 'main') {
    // TODO: Handle accent/neutral from localStorage when implemented
    console.warn(`[ThemeConfig] ${colorType} colors not yet implemented, using main color`);
  }

  return DEFAULT_ROLE_COLORS[role];
};

export const saveUserRoleColor = async (
  role: AppRole,
  color: HslColor,
  userId?: string,
  colorType: 'main' | 'accent' | 'neutral' = 'main'
): Promise<void> => {
  if (colorType !== 'main') {
    console.warn(`[ThemeConfig] Only main color supported currently`);
    return;
  }

  try {
    const storageKey = STORAGE_KEYS.userRoleColors;
    const userColors = JSON.parse(localStorage.getItem(storageKey) || '{}');
    userColors[role] = color;
    localStorage.setItem(storageKey, JSON.stringify(userColors));
  } catch (error) {
    console.error('[ThemeConfig] Failed to save color to localStorage:', error);
  }

  if (userId) {
    try {
      const pending = JSON.parse(localStorage.getItem(STORAGE_KEYS.pendingChanges) || '{}');
      pending[`${role}-${colorType}`] = { color, timestamp: Date.now() };
      localStorage.setItem(STORAGE_KEYS.pendingChanges, JSON.stringify(pending));
    } catch (error) {
      console.warn(`[ThemeConfig] Failed to queue DB sync:`, error);
    }
  }
};

export const getThemeMode = (): ThemeMode => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.themeMode);
    return (saved as ThemeMode) || 'light';
  } catch {
    return 'light';
  }
};

export const saveThemeMode = (mode: ThemeMode): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.themeMode, mode);
  } catch (error) {
    console.error('[ThemeConfig] Failed to save theme mode:', error);
  }
};