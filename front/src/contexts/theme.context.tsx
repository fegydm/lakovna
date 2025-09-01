// File: front/src/contexts/theme.context.tsx
// Last change: Fixed imports (CSS_ROLE_MAP + role colors moved to project config),
// ensured roleColors fallback to avoid undefined values.

import React, { createContext, useState, useEffect, useContext, ReactNode, useRef } from 'react';
import type { ThemeSettings, HslColor } from 'common/types/shared/theme.types';
import type { ProjectOrgType } from 'common/types/project/org-type.types';
import type { ThemeMode } from 'common/types/universal/theme-mode.types';

import { SYSTEM_COLORS } from 'common/configs/universal/colors.config';
import { DESIGN_CONSTANTS } from 'common/configs/universal/ui.config';
import { PROJECT_ROLE_COLORS, CSS_ROLE_MAP } from 'common/configs/project/colors.config';
import { getUserRoleColor, saveUserRoleColor, getThemeMode, saveThemeMode } from 'common/configs/project/theme.config';

import { semanticLevelsManager, DOTS_ROLE_COLORS, DOTS_STATUS_COLORS } from 'common/utils/dot-colors.utils';
import { generateSystemVariables, hslToCss, generateSystemSemanticVariables } from 'common/utils/color.utils';
import type { SemanticLevel } from 'common/utils/dot-colors.utils';

export interface ThemeContextValue {
  settings: ThemeSettings | null;
  activeRole: ProjectOrgType | null;
  setActiveRole: (role: ProjectOrgType) => void;
  updateRoleColor: (role: ProjectOrgType, newColor: HslColor) => Promise<void>;
  updateSemanticLevels: (role: ProjectOrgType, levels: Partial<Record<string, number>>) => void;
  setMode: (mode: ThemeMode) => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

interface ThemeProviderProps {
  children: ReactNode;
  initialRole?: ProjectOrgType;
  userId?: string;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

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

const buildVariablesCss = (
  settings: ThemeSettings,
  userId?: string
): string => {
  const lines: string[] = [];
  const roles = Object.keys(PROJECT_ROLE_COLORS) as ProjectOrgType[];

  // System variables
  const systemVars = generateSystemVariables(
    settings.typography,
    settings.layout,
    SYSTEM_COLORS.textPrimary,
    SYSTEM_COLORS.textSecondary
  );
  Object.entries(systemVars).forEach(([k, v]) => lines.push(`  ${k}: ${v};`));

  // Role-specific CSS variables
  roles.forEach((role) => {
    const roleColor = settings.roleColors?.[role];
    if (!roleColor) return;

    const obfuscated = CSS_ROLE_MAP[role];
    if (!obfuscated) return;

    const semanticLevels = semanticLevelsManager.getLevels(role, userId);

    Object.entries(semanticLevels).forEach(([levelName, levelValue]) => {
      const adjusted = settings.mode === 'dark'
        ? semanticLevelsManager.adjustForDarkMode(levelValue, levelName as SemanticLevel)
        : levelValue;
      const triplet = `${roleColor.h} ${roleColor.s}% ${adjusted}%`;
      lines.push(`  --${obfuscated}-${levelName}: ${triplet};`);
    });

    const emphasisLightness = semanticLevels.emphasis;
    const contrastColor = emphasisLightness < 60
      ? '0 0% 100%'
      : hslToCss(SYSTEM_COLORS.textPrimary);
    lines.push(`  --${obfuscated}-contrast: ${contrastColor};`);
  });

  // DOTS role colors
  Object.entries(DOTS_ROLE_COLORS).forEach(([role, colorValue]) => {
    lines.push(`  --dot-role-${role}: ${colorValue};`);
  });

  // DOTS status colors
  Object.entries(DOTS_STATUS_COLORS).forEach(([status, colorValue]) => {
    lines.push(`  --dot-status-${status}: ${colorValue};`);
  });

  const rootRule = `:root {\n${lines.join('\n')}\n}`;
  const schemeRule = `:root[data-theme="light"] { color-scheme: light; }\n:root[data-theme="dark"] { color-scheme: dark; }`;
  return `${rootRule}\n${schemeRule}\n`;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialRole = 'bodyshop',
  userId
}) => {
  const [settings, setSettings] = useState<ThemeSettings | null>(null);
  const [activeRole, setActiveRoleState] = useState<ProjectOrgType>(initialRole);
  const versionRef = useRef(0);

  useEffect(() => {
    let alive = true;
    const myVersion = ++versionRef.current;

    const initializeTheme = async () => {
      try {
        const mode = getThemeMode();
        const roleColors: Record<ProjectOrgType, HslColor> = { ...PROJECT_ROLE_COLORS };

        // Load user customizations with fallback
        for (const role of Object.keys(PROJECT_ROLE_COLORS) as ProjectOrgType[]) {
          try {
            const userColor = await getUserRoleColor(role, userId, 'main');
            roleColors[role] = userColor ?? PROJECT_ROLE_COLORS[role];
          } catch {
            roleColors[role] = PROJECT_ROLE_COLORS[role];
          }
        }

        const themeSettings: ThemeSettings = {
          primaryColor: SYSTEM_COLORS.primary,
          secondaryColor: SYSTEM_COLORS.textSecondary,
          mode,
          activeRole,
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
    return () => { alive = false; };
  }, [userId]);

  useEffect(() => {
    if (settings) applyThemeToDOM(settings);
  }, [activeRole, settings]);

  const applyThemeToDOM = (nextSettings: ThemeSettings) => {
    try {
      if (typeof document === 'undefined') return;
      const cssText = buildVariablesCss(nextSettings, userId);
      const styleEl = ensureStyleTag();
      if (styleEl && styleEl.textContent !== cssText) styleEl.textContent = cssText;

      const root = document.documentElement;
      root.setAttribute('data-theme', nextSettings.mode);
      root.setAttribute('data-active-role', activeRole);
    } catch (error) {
      console.error('[ThemeProvider] Failed to apply theme:', error);
    }
  };

  const setActiveRole = (role: ProjectOrgType): void => {
    setActiveRoleState(role);
    if (settings) setSettings(prev => (prev ? { ...prev, activeRole: role } : prev));
  };

  const updateRoleColor = async (role: ProjectOrgType, newColor: HslColor): Promise<void> => {
    try {
      await saveUserRoleColor(role, newColor, userId, 'main');
      setSettings(prev => {
        if (!prev) return prev;
        return { ...prev, roleColors: { ...prev.roleColors, [role]: newColor } };
      });
    } catch (error) {
      console.error('[ThemeProvider] Failed to update role color:', error);
      throw error;
    }
  };

  const setMode = (mode: ThemeMode): void => {
    try {
      saveThemeMode(mode);
      setSettings(prev => (prev ? { ...prev, mode } : prev));
    } catch (error) {
      console.error('[ThemeProvider] Failed to set mode:', error);
    }
  };

  const updateSemanticLevels = (role: ProjectOrgType, levels: Partial<Record<string, number>>): void => {
    semanticLevelsManager.setRoleLevels(role, levels as any);
    if (settings) applyThemeToDOM(settings);
  };

  const toggleDarkMode = (): void => {
    const newMode = settings?.mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
  };

  const contextValue: ThemeContextValue = {
    settings,
    activeRole,
    setActiveRole,
    updateRoleColor,
    updateSemanticLevels,
    setMode,
    toggleDarkMode,
    isDarkMode: settings?.mode === 'dark',
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
