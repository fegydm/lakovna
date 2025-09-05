// File: common/types/shared.types.ts
// Last change: Initial atomization from project.types.ts.
// Contains shared, generic, and system-level types used across the application.

import {
  LOG_LEVELS,
  ZODIAC_SIGNS,
  GROUPED_LANGUAGE_TYPES,
  WEBSOCKET_EVENTS,
  PROJECT_CATEGORIES,
  PROJECT_ORG_TYPES,
} from '../configs/01-constants.config';
import { APP_CONFIG } from '../configs/03-app.config';
import { I18N_CONFIG } from '../configs/05-i18n.config';

export type IsoDateString = string;

export interface ApiResponse<T = unknown> {
  isSuccess: boolean;
  data?: T;
  error?: string;
  statusMessage?: string;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface LogContext {
  [key: string]: any;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  url?: string;
  userAgent?: string;
}

export interface CountryMetadata {
  ccIso2: string;
  nameEn: string;
  nameLocal: string;
  nameSk: string;
  ccIso3?: string;
  numericCode?: string;
  phoneCode?: string;
  continentId?: number;
  isEu?: boolean;
  isSchengen?: boolean;
  capitalEn?: string;
  currencyCode?: string;
  drivingSide?: 'left' | 'right';
  areaKm2?: number;
  createdAt?: IsoDateString;
  updatedAt?: IsoDateString;
}

export interface Language {
  lcIso2: string;
  ccIso2: string;
  nameEn: string;
  nativeName: string;
  isRtl: boolean;
}

export interface GroupedLanguage extends Language {
  group: GroupedLanguageType;
}
export type ConsoleMethod = 'log' | 'info' | 'warn' | 'error';
export type ProjectCategory =
  typeof PROJECT_CATEGORIES[keyof typeof PROJECT_CATEGORIES];
export type ProjectOrgType =
  typeof PROJECT_ORG_TYPES[keyof typeof PROJECT_ORG_TYPES];
export type LogLevel = typeof LOG_LEVELS[keyof typeof LOG_LEVELS];
export type GroupedLanguageType =
  typeof GROUPED_LANGUAGE_TYPES[keyof typeof GROUPED_LANGUAGE_TYPES];
export type WebSocketEvent =
  typeof WEBSOCKET_EVENTS[keyof typeof WEBSOCKET_EVENTS];
export type StorageKey =
  typeof APP_CONFIG.technical.storageKeys[keyof typeof APP_CONFIG.technical.storageKeys];
export type PreloadPriorityLanguage = typeof I18N_CONFIG.preloadPriority[number];
export type ZodiacSign = typeof ZODIAC_SIGNS[keyof typeof ZODIAC_SIGNS];