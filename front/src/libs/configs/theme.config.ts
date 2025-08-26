// File: lakovna/front/src/libs/configs/theme.config.ts
// Last change: Simple theme config for future user color customization in workshop system

import type { HslColor, ThemeSettings } from '../types/systems/theme.types';
import type { AppRole } from '../types/systems/app_role.types';
import type { ThemeMode } from '../types/systems/theme_mode.types';
import { DEFAULT_ROLE_COLORS, SYSTEM_COLORS } from './colors.config';

const LAKOVNA_STORAGE_KEYS = {
  themeMode: 'lakovna-theme-mode',
  userRoleColors: 'lakovna-user-role-colors',
  userSettings: 'lakovna-user-settings',
} as const;

export const DEFAULT_THEME_SETTINGS: Omit<ThemeSettings, 'primaryColor' | 'secondaryColor' | 'mode'> = {
  typography: {
    fontSizeBase: 14
  },
  layout: {
    borderRadius: 8
  },
};

/**
 * Get user's custom color for a specific role
 * Falls back to default if no customization exists
 */
export const getUserRoleColor = async (
  role: AppRole,
  userId?: string
): Promise<HslColor> => {
  // Future: API call for user-specific colors
  if (userId) {
    try {
      // TODO: Database lookup when user system is implemented
      // const response = await api.get(`/users/${userId}/theme/colors/${role}`);
      // return response.data.color;
    } catch (error) {
      console.warn(`Failed to fetch theme color for user ${userId}, role ${role}:`, error);
    }
  }

  // Check localStorage for user customization
  try {
    const stored = localStorage.getItem(LAKOVNA_STORAGE_KEYS.userRoleColors);
    if (stored) {
      const userColors = JSON.parse(stored) as Partial<Record<AppRole, HslColor>>;
      if (userColors[role]) {
        return userColors[role]!;
      }
    }
  } catch (error) {
    console.warn('Failed to parse stored user colors:', error);
  }

  // Fallback to default
  return DEFAULT_ROLE_COLORS[role];
};

/**
 * Save user's custom color for a specific role
 * Stores locally and queues for DB sync when user system exists
 */
export const saveUserRoleColor = async (
  role: AppRole,
  color: HslColor,
  userId?: string
): Promise<void> => {
  // Save to localStorage immediately
  try {
    const stored = localStorage.getItem(LAKOVNA_STORAGE_KEYS.userRoleColors);
    const userColors = stored ? JSON.parse(stored) : {};
    userColors[role] = color;
    localStorage.setItem(LAKOVNA_STORAGE_KEYS.userRoleColors, JSON.stringify(userColors));
  } catch (error) {
    console.error('Failed to save color to localStorage:', error);
    throw error;
  }

  // Future: Sync to database
  if (userId) {
    try {
      // TODO: API call when user system is implemented
      // await api.post(`/users/${userId}/theme/colors/${role}`, { color });
    } catch (error) {
      console.warn(`Failed to sync color to server for user ${userId}:`, error);
      // Store for later sync
      try {
        const pending = JSON.parse(localStorage.getItem('lakovna-pending-sync') || '{}');
        pending[`color-${userId}-${role}`] = { color, timestamp: Date.now() };
        localStorage.setItem('lakovna-pending-sync', JSON.stringify(pending));
      } catch (syncError) {
        console.error('Failed to queue color for later sync:', syncError);
      }
    }
  }
};

/**
 * Get user's theme mode preference
 */
export const getThemeMode = (): ThemeMode => {
  try {
    const saved = localStorage.getItem(LAKOVNA_STORAGE_KEYS.themeMode);
    return (saved as ThemeMode) || 'light';
  } catch {
    return 'light';
  }
};

/**
 * Save user's theme mode preference
 */
export const saveThemeMode = (mode: ThemeMode): void => {
  try {
    localStorage.setItem(LAKOVNA_STORAGE_KEYS.themeMode, mode);
  } catch (error) {
    console.error('Failed to save theme mode:', error);
  }
};

/**
 * Reset user's theme customizations to defaults
 */
export const resetUserTheme = async (userId?: string): Promise<void> => {
  try {
    localStorage.removeItem(LAKOVNA_STORAGE_KEYS.userRoleColors);
    localStorage.removeItem(LAKOVNA_STORAGE_KEYS.userSettings);
    
    if (userId) {
      // TODO: API call to reset server-side preferences
      // await api.delete(`/users/${userId}/theme`);
    }
  } catch (error) {
    console.error('Failed to reset user theme:', error);
    throw error;
  }
};

/**
 * Get complete user theme settings
 * Merges defaults with user customizations
 */
export const getUserThemeSettings = async (userId?: string): Promise<ThemeSettings> => {
  const mode = getThemeMode();
  
  // Load user's role colors
  const roleColors: Record<AppRole, HslColor> = { ...DEFAULT_ROLE_COLORS };
  for (const role of ['admin', 'manager', 'worker', 'viewer'] as AppRole[]) {
    try {
      roleColors[role] = await getUserRoleColor(role, userId);
    } catch {
      // Keep default color on error
    }
  }

  return {
    primaryColor: SYSTEM_COLORS.primary,
    secondaryColor: SYSTEM_COLORS.textSecondary,
    mode,
    roleColors,
    activeRole: 'worker', // Default active role
    ...DEFAULT_THEME_SETTINGS,
  };
};

/**
 * Sync pending changes to server (for future use)
 */
export const syncPendingThemeChanges = async (userId: string): Promise<void> => {
  try {
    const pending = localStorage.getItem('lakovna-pending-sync');
    if (!pending) return;

    const changes = JSON.parse(pending);
    
    // TODO: Batch sync to API
    // await api.post(`/users/${userId}/theme/sync`, { changes });
    
    // Clear pending changes after successful sync
    localStorage.removeItem('lakovna-pending-sync');
  } catch (error) {
    console.error('Failed to sync pending theme changes:', error);
  }
};