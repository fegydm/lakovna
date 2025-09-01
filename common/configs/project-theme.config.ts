// File: common/configs/project-theme-config.ts

import { DESIGN_CONSTANTS } from './ui.config';
import type { ThemeSettings } from '../types/theme.types';

export const DEFAULT_THEME_SETTINGS: Omit<ThemeSettings, 'primaryColor' | 'secondaryColor' | 'mode'> = {
  typography: DESIGN_CONSTANTS.typography,
  layout: DESIGN_CONSTANTS.layout,
};

export const STORAGE_KEYS = DESIGN_CONSTANTS.technical.storageKeys;
