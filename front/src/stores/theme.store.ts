// File: front/src/stores/theme.store.ts
// Theme store for Lakovňa (v5) – refactored from old AppRole to ProjectOrgType

import { createStore } from "../utils/store.utils";
import type { HslColor, ThemeSettings, ThemeMode, ProjectOrgType } from "common/types/project.types";
import { PROJECT_COLOR_CONFIG } from "common/configs/project-colors.config";
import { PROJECT_ORG_TYPES } from "common/configs/enums.config";

export interface ThemeState {
  mode: ThemeMode;
  activeOrg: ProjectOrgType;
  roleColors: Record<ProjectOrgType, HslColor>;
}

// 🟢 Store instance
export const themeStore = createStore<ThemeState>({
  mode: "light",
  activeOrg: PROJECT_ORG_TYPES.BODYSHOP, // default org type
  roleColors: { ...PROJECT_COLOR_CONFIG.projectRoleColors },
});

// 🟠 Hook pre React komponenty
export const useThemeStore = themeStore.useStore;

// 🛠️ Utility funkcie
export const setThemeMode = (mode: ThemeMode) => {
  themeStore.setState({ mode });
};

export const setActiveOrg = (org: ProjectOrgType) => {
  themeStore.setState({ activeOrg: org });
};

export const updateRoleColor = (org: ProjectOrgType, newColor: HslColor) => {
  const { roleColors } = themeStore.getState();
  themeStore.setState({
    roleColors: { ...roleColors, [org]: newColor },
  });
};

// Optional helper – build ThemeSettings object (useful for FE components)
export const getThemeSettings = (): ThemeSettings => {
  const state = themeStore.getState();
  return {
    primaryColor: state.roleColors[state.activeOrg],
    secondaryColor: PROJECT_COLOR_CONFIG.systemColors.textSecondary as HslColor,
    mode: state.mode,
    typography: { fontSizeBase: 16 },
    layout: { borderRadius: 8 },
    roleColors: state.roleColors,
    activeRole: state.activeOrg,
  };
};