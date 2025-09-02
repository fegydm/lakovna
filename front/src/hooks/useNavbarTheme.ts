// File: front/src/hooks/useNavbarTheme.ts
// Handles dark/light mode and breadcrumb toggle

import { useState } from 'react';
import { useTheme } from '../contexts/theme.context';

export const useNavbarTheme = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showBreadcrumbs, setShowBreadcrumbs] = useState(false);

  const handleBreadcrumbsToggle = () => {
    setShowBreadcrumbs((prev) => !prev);
  };

  return {
    isDarkMode,
    toggleDarkMode,
    showBreadcrumbs,
    handleBreadcrumbsToggle,
  };
};
