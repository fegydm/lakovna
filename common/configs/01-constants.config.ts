// File: common/configs/01-constants.config.ts
// Last change: Renamed file and added AUTH_STATUSES constant.

export const ACCESS_ROLES = {
  SUPERADMIN: 'superadmin',
  DEVELOPER: 'developer',
  OWNER: 'owner',
  MANAGER: 'manager',
  COORDINATOR: 'coordinator',
  WORKER: 'worker',
  PARTNER: 'partner',
  VIEWER: 'viewer',
} as const;

export const AUTH_METHODS = {
  PASSWORD: 'password',
  GOOGLE: 'google',
  RFID: 'rfid',
  QR: 'qr',
  USB: 'usb',
} as const;

export const AUTH_STATUSES = {
  ANONYMOUS: 'anonymous',
  COOKIES: 'cookies',
  REGISTERED: 'registered',
} as const;

export const MEMBERSHIP_STATUSES = {
  PENDING: 'pending',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export const TASK_PROGRESS_STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  ON_HOLD: 'on_hold',
} as const;

export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const PROJECT_CATEGORIES = {
  PAINT: 'paint',
  MECHANICAL: 'mechanical',
  FULL_SERVICE: 'full_service',
} as const;

export const PROJECT_ORG_TYPES = {
  BODYSHOP: 'bodyshop',
  SERVICE: 'service',
  DEALER: 'dealer',
  TUNING: 'tuning',
  WRAPSHOP: 'wrapshop',
  DETAILING: 'detailing',
} as const;

export const PROTECTED_RESOURCE_TYPES = {
  SC: 'sc',
  DOC: 'doc',
  RT: 'rt',
} as const;

export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const;

export const GROUPED_LANGUAGE_TYPES = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  RECENT: 'recent',
  OTHER: 'other',
} as const;

export const ZODIAC_SIGNS = {
  ARIES: "aries",
  TAURUS: "taurus",
  GEMINI: "gemini",
  CANCER: "cancer",
  LEO: "leo",
  VIRGO: "virgo",
  LIBRA: "libra",
  SCORPIO: "scorpio",
  SAGITTARIUS: "sagittarius",
  CAPRICORN: "capricorn",
  AQUARIUS: "aquarius",
  PISCES: "pisces",
} as const;