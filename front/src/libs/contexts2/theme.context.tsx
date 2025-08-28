// File: lakovna/front/src/libs/contexts/theme.context.tsx
// Last change: Workshop theme context using external config and universal color utils

import React, { createContext, useState, useEffect, useContext, ReactNode, useRef } from 'react';
import type { ThemeSettings, HslColor } from '../types/systems/theme.types';
import type { AppRole } from '../../../../common/types/app-role.types';
import type { ThemeMode } from '../types/systems/theme_mode.types';
import { SYSTEM_COLORS, DEFAULT_ROLE_COLORS, WORKSHOP_COLORS, semanticLevelsManager, DEFAULT_SEMANTIC_LEVELS } from '../configs/colors.config';
import { generateSystemVariables, hslToCss, generateSystemSemanticVariables, generateSemanticColorSystem } from '../utils/color.utils';

export interface ThemeContextValue {
  settings: ThemeSettings | null;
  activeRole: AppRole | null;
  setActiveRole: (role: AppRole) => void;
  updateRoleColor: (role: AppRole, newColor: HslColor) => void;
  updateSemanticLevels: (role: AppRole, levels: Partial<Record<string, number>>) => void;
  setMode: (mode: ThemeMode) => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

interface ThemeProviderProps {
  children: ReactNode;
  initialRole?: AppRole;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

const STYLE_TAG_ID = 'lakovna-theme-variables';

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

const buildWorkshopVariablesCss = (settings: ThemeSettings): string => {
  const lines: string[] = [];
  
  // System variables from external config - provide all required parameters
  const systemVars = generateSystemVariables(
    settings.typography,
    settings.layout,
    SYSTEM_COLORS.textPrimary,
    SYSTEM_COLORS.textSecondary
  );
  Object.entries(systemVars).forEach(([k, v]) => {
    lines.push(`  --${k}: ${v};`);
  });
  
  // Text colors from system config
  lines.push(`  --text-primary: ${hslToCss(SYSTEM_COLORS.textPrimary)};`);
  lines.push(`  --text-secondary: ${hslToCss(SYSTEM_COLORS.textSecondary)};`);
  lines.push(`  --text-tertiary: ${hslToCss(SYSTEM_COLORS.textTertiary)};`);
  lines.push(`  --text-inverse: ${hslToCss(SYSTEM_COLORS.textInverse)};`);
  
  // Surface colors from system config
  lines.push(`  --sys-background: ${hslToCss(SYSTEM_COLORS.background)};`);
  lines.push(`  --sys-surface: ${hslToCss(SYSTEM_COLORS.surface)};`);
  lines.push(`  --sys-input: ${hslToCss(SYSTEM_COLORS.input)};`);
  lines.push(`  --sys-border: ${hslToCss(SYSTEM_COLORS.border)};`);
  lines.push(`  --sys-border-hover: ${hslToCss(SYSTEM_COLORS.borderHover)};`);
  
  // Semantic levels from external config with dark mode adjustment
  const adjust = (lvl: number, name: string) =>
    settings.mode === 'dark' ? semanticLevelsManager.adjustForDarkMode(lvl, name) : lvl;
    
  const sysSemVars = generateSystemSemanticVariables(
    adjust,
    SYSTEM_COLORS.primary,
    DEFAULT_SEMANTIC_LEVELS
  );
  Object.entries(sysSemVars).forEach(([k, v]) => {
    lines.push(`  --${k}: ${v};`);
  });
  
  // Primary theme color with variants
  const primaryTriplet = hslToCss(settings.primaryColor);
  lines.push(`  --emphasis: ${primaryTriplet};`);
  lines.push(`  --emphasis-contrast: ${settings.primaryColor.l > 50 ? '0 0% 0%' : '0 0% 100%'};`);
  lines.push(`  --hover: ${settings.primaryColor.h} ${settings.primaryColor.s}% ${Math.max(0, settings.primaryColor.l - 10)}%;`);
  lines.push(`  --active: ${settings.primaryColor.h} ${settings.primaryColor.s}% ${Math.max(0, settings.primaryColor.l - 15)}%;`);
  
  // Role colors for button variants from external config
  const roleColors = settings.roleColors || DEFAULT_ROLE_COLORS;
  Object.entries(roleColors).forEach(([role, color]) => {
    if (!color) return; // Skip if color is undefined
    const triplet = hslToCss(color);
    lines.push(`  --role-${role}: ${triplet};`);
    lines.push(`  --role-${role}-contrast: ${color.l > 50 ? '0 0% 0%' : '0 0% 100%'};`);
  });
  
  // Workshop semantic colors from external config
  Object.entries(WORKSHOP_COLORS).forEach(([name, color]) => {
    const kebabName = name.replace(/([A-Z])/g, '-$1').toLowerCase();
    const triplet = hslToCss(color);
    lines.push(`  --workshop-${kebabName}: ${triplet};`);
  });
  
  // Semantic color system from external config  
  const semanticColorSystem = generateSemanticColorSystem({
    success: SYSTEM_COLORS.success,
    warning: SYSTEM_COLORS.warning,
    danger: SYSTEM_COLORS.danger,
    info: SYSTEM_COLORS.info
  });
  Object.entries(semanticColorSystem).forEach(([k, v]) => {
    lines.push(`  --${k}: ${v};`);
  });
  
  const rootRule = `:root {\n${lines.join('\n')}\n}`;
  const schemeRule = `:root[data-theme="light"] { color-scheme: light; }\n:root[data-theme="dark"] { color-scheme: dark; }`;
  
  return `${rootRule}\n${schemeRule}\n`;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialRole = 'worker'
}) => {
  const [settings, setSettings] = useState<ThemeSettings | null>(null);
  const [activeRole, setActiveRoleState] = useState<AppRole>(initialRole);
  const versionRef = useRef(0);

  useEffect(() => {
    let alive = true;
    const myVersion = ++versionRef.current;

    const initializeTheme = () => {
      try {
        // Get saved theme mode from localStorage or default to light
        const savedMode = localStorage.getItem('lakovna-theme-mode') as ThemeMode || 'light';
        
        const themeSettings: ThemeSettings = {
          primaryColor: SYSTEM_COLORS.primary,
          secondaryColor: SYSTEM_COLORS.textSecondary,
          mode: savedMode,
          activeRole,
          roleColors: DEFAULT_ROLE_COLORS,
          typography: {
            fontSizeBase: 14
          },
          layout: {
            borderRadius: 8
          }
        };

        if (!alive || myVersion !== versionRef.current) return;

        setSettings(themeSettings);
        applyThemeToDOM(themeSettings);
      } catch (err) {
        console.error('[Lakovna ThemeProvider] Initialization failed:', err);
      }
    };

    initializeTheme();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (settings) {
      const updatedSettings = { ...settings, activeRole };
      setSettings(updatedSettings);
      applyThemeToDOM(updatedSettings);
    }
  }, [activeRole]);

  const applyThemeToDOM = (nextSettings: ThemeSettings) => {
    try {
      if (typeof document === 'undefined') return;
      
      const cssText = buildWorkshopVariablesCss(nextSettings);
      const styleEl = ensureStyleTag();
      if (styleEl && styleEl.textContent !== cssText) {
        styleEl.textContent = cssText;
      }

      const root = document.documentElement;
      root.setAttribute('data-theme', nextSettings.mode);
      root.setAttribute('data-active-role', activeRole);
    } catch (error) {
      console.error('[Lakovna ThemeProvider] Failed to apply theme:', error);
    }
  };

  const setActiveRole = (role: AppRole): void => {
    setActiveRoleState(role);
  };

  const updateRoleColor = (role: AppRole, newColor: HslColor): void => {
    setSettings(prev => {
      if (!prev) return prev;
      const updatedSettings = {
        ...prev,
        roleColors: { ...prev.roleColors, [role]: newColor }
      };
      applyThemeToDOM(updatedSettings);
      return updatedSettings;
    });
  };

  const setMode = (mode: ThemeMode): void => {
    try {
      localStorage.setItem('lakovna-theme-mode', mode);
      setSettings(prev => {
        if (!prev) return prev;
        const updatedSettings = { ...prev, mode };
        applyThemeToDOM(updatedSettings);
        return updatedSettings;
      });
    } catch (error) {
      console.error('[Lakovna ThemeProvider] Failed to set mode:', error);
    }
  };

  const updateSemanticLevels = (role: AppRole, levels: Partial<Record<string, number>>): void => {
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