// File: front/src/stores/theme.store.ts
// Theme store for Lakovňa (v5) – refactored from old AppRole to ProjectOrgType

import { createStore } from "common/utils/store.utils";
import type { HslColor, ThemeSettings } from "common/types/theme.types";
import type { ThemeMode } from "common/types/theme-mode.types";
import type { ProjectOrgType } from "common/types/org-type.types";
import { PROJECT_ROLE_COLORS } from "common/configs/project-colors.config";
import { SYSTEM_COLORS } from "common/configs/universal-colors.config";



interface ThemeState {
  mode: ThemeMode;
  activeOrg: ProjectOrgType;
  roleColors: Record<ProjectOrgType, HslColor>;
}

// 🟢 Store instance
export const themeStore = createStore<ThemeState>({
  mode: "light",
  activeOrg: "bodyshop", // default org type
  roleColors: { ...PROJECT_ROLE_COLORS },
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
    secondaryColor: SYSTEM_COLORS.textSecondary,
    mode: state.mode,
    typography: { fontSizeBase: 16 },
    layout: { borderRadius: 8 },
    roleColors: state.roleColors,
    activeRole: state.activeOrg,
  };
};
