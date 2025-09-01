// File: front/src/hooks/useNavbarTheme.ts
// Handles dark/light mode

import { useTheme } from '../contexts/theme.context';

export const useNavbarTheme = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return {
    isDarkMode,
    toggleDarkMode,
  };
};
