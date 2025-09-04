// File: front/src/contexts/theme.context.tsx
// Last change: Refactored from AppRole → ProjectOrgType, unified naming with theme.store.ts

import React, { createContext, useState, useEffect, useContext, ReactNode, useRef } from 'react';
import type { ThemeSettings, HslColor } from 'common/types/theme.types';
import type { ProjectOrgType } from 'common/types/organization.types';
import type { ThemeMode } from 'common/types/theme-mode.types';

import { SYSTEM_COLORS } from 'common/configs/universal-colors.config';
import { DESIGN_CONSTANTS } from 'common/configs/ui.config';
import { PROJECT_ROLE_COLORS, CSS_ROLE_MAP } from 'common/configs/project-colors.config';
import { getUserRoleColor, saveUserRoleColor, getThemeMode, saveThemeMode } 
  from 'front/src/utils/theme-storage.utils';

import { semanticLevelsManager, DOTS_ROLE_COLORS, DOTS_STATUS_COLORS } from 'common/utils/dot-colors.utils';
import { generateSystemVariables, hslToCss } from 'common/utils/color.utils';
import type { SemanticLevel } from 'common/utils/dot-colors.utils';

// ==========================================
// Context Value
// ==========================================
export interface ThemeContextValue {
  settings: ThemeSettings | null;
  activeOrg: ProjectOrgType | null;
  setActiveOrg: (org: ProjectOrgType) => void;
  updateOrgColor: (org: ProjectOrgType, newColor: HslColor) => Promise<void>;
  updateSemanticLevels: (org: ProjectOrgType, levels: Partial<Record<string, number>>) => void;
  setMode: (mode: ThemeMode) => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

interface ThemeProviderProps {
  children: ReactNode;
  initialOrg?: ProjectOrgType;
  userId?: string;
}

// ==========================================
// Hook
// ==========================================
export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

// ==========================================
// Helpers
// ==========================================
const STYLE_TAG_ID = 'app-theme-variables';

const ensureStyleTag = (): HTMLStyleElement | null => {
  if (typeof document === 'undefined') return null;
  let styleEl = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = STYLE_TAG_ID;
    document.head.appendChild(styleEl);
  }
  return styleEl;
};

const buildVariablesCss = (settings: ThemeSettings, userId?: string): string => {
  const lines: string[] = [];
  const orgTypes = Object.keys(PROJECT_ROLE_COLORS) as ProjectOrgType[];

  // System vars
  const systemVars = generateSystemVariables(
    settings.typography,
    settings.layout,
    SYSTEM_COLORS.textPrimary,
    SYSTEM_COLORS.textSecondary
  );
  Object.entries(systemVars).forEach(([k, v]) => lines.push(`  ${k}: ${v};`));

  // Org-type role colors
  orgTypes.forEach((org) => {
    const roleColor = settings.roleColors?.[org];
    if (!roleColor) return;

    const obfuscated = CSS_ROLE_MAP[org];
    if (!obfuscated) return;

    const semanticLevels = semanticLevelsManager.getLevels(org, userId);

    Object.entries(semanticLevels).forEach(([levelName, levelValue]) => {
      const adjusted =
        settings.mode === 'dark'
          ? semanticLevelsManager.adjustForDarkMode(levelValue, levelName as SemanticLevel)
          : levelValue;
      const triplet = `${roleColor.h} ${roleColor.s}% ${adjusted}%`;
      lines.push(`  --${obfuscated}-${levelName}: ${triplet};`);
    });

    const emphasisLightness = semanticLevels.emphasis;
    const contrastColor =
      emphasisLightness < 60
        ? '0 0% 100%'
        : hslToCss(SYSTEM_COLORS.textPrimary);
    lines.push(`  --${obfuscated}-contrast: ${contrastColor};`);
  });

  // DOTS role/status colors
  Object.entries(DOTS_ROLE_COLORS).forEach(([role, colorValue]) => {
    lines.push(`  --dot-role-${role}: ${colorValue};`);
  });
  Object.entries(DOTS_STATUS_COLORS).forEach(([status, colorValue]) => {
    lines.push(`  --dot-status-${status}: ${colorValue};`);
  });

  return `:root {\n${lines.join('\n')}\n}\n:root[data-theme="light"] { color-scheme: light; }\n:root[data-theme="dark"] { color-scheme: dark; }`;
};

// ==========================================
// Provider
// ==========================================
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialOrg = 'bodyshop',
  userId,
}) => {
  const [settings, setSettings] = useState<ThemeSettings | null>(null);
  const [activeOrg, setActiveOrgState] = useState<ProjectOrgType>(initialOrg);
  const versionRef = useRef(0);

  useEffect(() => {
    let alive = true;
    const myVersion = ++versionRef.current;

    const initializeTheme = async () => {
      try {
        const mode = getThemeMode();
        const roleColors: Record<ProjectOrgType, HslColor> = { ...PROJECT_ROLE_COLORS };

        for (const org of Object.keys(PROJECT_ROLE_COLORS) as ProjectOrgType[]) {
          try {
            const userColor = await getUserRoleColor(org, userId, 'main');
            roleColors[org] = userColor ?? PROJECT_ROLE_COLORS[org];
          } catch {
            roleColors[org] = PROJECT_ROLE_COLORS[org];
          }
        }

        const themeSettings: ThemeSettings = {
          primaryColor: SYSTEM_COLORS.primary,
          secondaryColor: SYSTEM_COLORS.textSecondary,
          mode,
          activeRole: activeOrg, // still stored under "activeRole" in ThemeSettings
          roleColors,
          typography: DESIGN_CONSTANTS.typography,
          layout: DESIGN_CONSTANTS.layout,
        };

        if (!alive || myVersion !== versionRef.current) return;

        setSettings(themeSettings);
        applyThemeToDOM(themeSettings);
      } catch (err) {
        console.error('[ThemeProvider] init failed:', err);
      }
    };

    void initializeTheme();
    return () => {
      alive = false;
    };
  }, [userId]);

  useEffect(() => {
    if (settings) applyThemeToDOM(settings);
  }, [activeOrg, settings]);

  const applyThemeToDOM = (nextSettings: ThemeSettings) => {
    try {
      if (typeof document === 'undefined') return;
      const cssText = buildVariablesCss(nextSettings, userId);
      const styleEl = ensureStyleTag();
      if (styleEl && styleEl.textContent !== cssText) styleEl.textContent = cssText;

      const root = document.documentElement;
      root.setAttribute('data-theme', nextSettings.mode);
      root.setAttribute('data-active-org', activeOrg);
    } catch (error) {
      console.error('[ThemeProvider] Failed to apply theme:', error);
    }
  };

  const setActiveOrg = (org: ProjectOrgType): void => {
    setActiveOrgState(org);
    if (settings) setSettings((prev) => (prev ? { ...prev, activeRole: org } : prev));
  };

  const updateOrgColor = async (org: ProjectOrgType, newColor: HslColor): Promise<void> => {
    try {
      await saveUserRoleColor(org, newColor, userId, 'main');
      setSettings((prev) => {
        if (!prev) return prev;
        return { ...prev, roleColors: { ...prev.roleColors, [org]: newColor } };
      });
    } catch (error) {
      console.error('[ThemeProvider] Failed to update org color:', error);
      throw error;
    }
  };

  const setMode = (mode: ThemeMode): void => {
    try {
      saveThemeMode(mode);
      setSettings((prev) => (prev ? { ...prev, mode } : prev));
    } catch (error) {
      console.error('[ThemeProvider] Failed to set mode:', error);
    }
  };

  const updateSemanticLevels = (org: ProjectOrgType, levels: Partial<Record<string, number>>): void => {
    semanticLevelsManager.setRoleLevels(org, levels as any);
    if (settings) applyThemeToDOM(settings);
  };

  const toggleDarkMode = (): void => {
    const newMode = settings?.mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
  };

  const contextValue: ThemeContextValue = {
    settings,
    activeOrg,
    setActiveOrg,
    updateOrgColor,
    updateSemanticLevels,
    setMode,
    toggleDarkMode,
    isDarkMode: settings?.mode === 'dark',
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};
