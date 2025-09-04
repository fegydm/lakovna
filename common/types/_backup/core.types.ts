// File: common/types/core.types.ts
// Last change: Consolidated all core and reusable types.

import type { HslColor } from './core.types';

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
  group: 'primary' | 'secondary' | 'recent' | 'other';
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export type ColorMap<T extends string = string> = Record<T, HslColor>;

export type SemanticColor =
  | 'background'
  | 'surface'
  | 'input'
  | 'border'
  | 'muted'
  | 'emphasis'
  | 'hover'
  | 'active'
  | 'subtle'
  | 'overlay'
  | 'accent'
  | 'light';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

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

export interface ThemeRoleColorMap {
  [key: string]: HslColor;
}

export interface ThemeSettings {
  primaryColor: HslColor;
  secondaryColor?: HslColor;
  mode: ThemeMode;
  typography: {
    fontSizeBase: number;
  };
  layout: {
    borderRadius: number;
  };
  roleColors?: ThemeRoleColorMap;
  activeRole?: string;
}

export interface DotCategoryConfig {
  label: string;
  description: string;
  color: HslColor;
  icon: string;
}

export interface DotStatusConfig {
  label: string;
  description: string;
  color: HslColor;
  icon: string;
}

export type ProtectedResourceType = 'sc' | 'doc' | 'rt';