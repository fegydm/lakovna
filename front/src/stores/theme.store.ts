// File: front/src/stores/theme.store.ts
import { createStore } from "../../../common/utils/createStore";
import type { HslColor } from "../../../common/types/shared/theme.types";
import type { ThemeMode } from "../../../common/types/universal/theme-mode.types";
import { DEFAULT_ROLE_COLORS } from "../libs/configs/colors.config";

export type AppRole = "hauler" | "sender" | "broker";

interface ThemeState {
  mode: ThemeMode;
  activeRole: AppRole;
  roleColors: Record<AppRole, HslColor>;
}

// 🟢 Store instance
export const themeStore = createStore<ThemeState>({
  mode: "light",
  activeRole: "hauler",
  roleColors: { ...DEFAULT_ROLE_COLORS },
});

// 🟠 Hook pre React komponenty
export const useThemeStore = themeStore.useStore;

// 🛠️ Utility funkcie
export const setThemeMode = (mode: ThemeMode) => {
  themeStore.setState({ mode });
};

export const setActiveRole = (role: AppRole) => {
  themeStore.setState({ activeRole: role });
};

export const updateRoleColor = (role: AppRole, newColor: HslColor) => {
  const { roleColors } = themeStore.getState();
  themeStore.setState({
    roleColors: { ...roleColors, [role]: newColor },
  });
};
