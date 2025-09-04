// File: common/configs/logger.config.ts
// Last change: Centralized logger configuration constants

import type { LogLevel } from '../types/logger.types';

export const LOGGER_CONFIG = {
  log_levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  } as Record<LogLevel, number>,

  dev_styles: {
    debug: 'color: #6b7280; font-weight: normal;',
    info: 'color: #3b82f6; font-weight: bold;',
    warn: 'color: #f59e0b; font-weight: bold;',
    error: 'color: #ef4444; font-weight: bold; background: #fef2f2; padding: 2px 4px; border-radius: 3px;',
  } as Record<LogLevel, string>,
};