// File: common/configs/01-constants.config.ts
// Last change: Fixed definition order and synchronized enums with the Prisma schema.

export const ACCESS_ROLES = {
  SUPERADMIN: 'SUPERADMIN',
  DEVELOPER: 'DEVELOPER',
  OWNER: 'OWNER',
  MANAGER: 'MANAGER',
  COORDINATOR: 'COORDINATOR',
  WORKER: 'WORKER',
  PARTNER: 'PARTNER',
  VIEWER: 'VIEWER',
} as const;

/**
 * Defines roles that have elevated permissions for viewing data.
 * This MUST be defined after ACCESS_ROLES.
 */
export const PRIVILEGED_ACCESS_ROLES = [
  ACCESS_ROLES.OWNER,
  ACCESS_ROLES.MANAGER,
  ACCESS_ROLES.SUPERADMIN,
  ACCESS_ROLES.DEVELOPER,
] as const;

export const AUTH_METHODS = {
  PASSWORD: 'PASSWORD',
  GOOGLE: 'GOOGLE',
  RFID: 'RFID',
  QR: 'QR',
  USB: 'USB',
} as const;

export const AUTH_STATUSES = {
  ANONYMOUS: 'ANONYMOUS',
  COOKIES: 'COOKIES',
  REGISTERED: 'REGISTERED',
} as const;

export const MEMBERSHIP_STATUSES = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED', // PRIDANÉ: Synchronizácia s Prisma schémou
} as const;

export const TASK_PROGRESS_STATUSES = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  BLOCKED: 'BLOCKED',
  CANCELLED: 'CANCELLED',
  FAILED: 'FAILED',      
  ON_HOLD: 'ON_HOLD',    
} as const;

export const TASK_PRIORITIES = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
  URGENT: 'URGENT',
} as const;

export const PROJECT_CATEGORIES = {
  PAINT: 'PAINT',
  MECHANICAL: 'MECHANICAL',
  FULL_SERVICE: 'FULL_SERVICE',
} as const;

export const PROJECT_ORG_TYPES = {
  BODYSHOP: 'BODYSHOP',
  SERVICE: 'SERVICE',
  DEALER: 'DEALER',
  TUNING: 'TUNING',
  WRAPSHOP: 'WRAPSHOP',
  DETAILING: 'DETAILING',
} as const;

export const PROTECTED_RESOURCE_TYPES = {
  SC: 'SC',
  DOC: 'DOC',
  RT: 'RT',
} as const;

export const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
} as const;

export const GROUPED_LANGUAGE_TYPES = {
  PRIMARY: 'PRIMARY',
  SECONDARY: 'SECONDARY',
  RECENT: 'RECENT',
  OTHER: 'OTHER',
} as const;

// NOTE: WebSocket event names are left in their original format as they represent an API contract.
export const WEBSOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  VEHICLE_POSITION_UPDATE: 'vehicle:position:update',
  VEHICLE_STATUS_CHANGE: 'vehicle:status:change',
  TASK_STARTED: 'task:started',
  TASK_COMPLETED: 'task:completed',
  STAGE_STATUS_CHANGE: 'stage:status:change',
  WORKER_JOINED: 'worker:joined',
  WORKER_LEFT: 'worker:left',
  ORGANIZATION_UPDATED: 'organization:updated',
  NOTIFICATION_SENT: 'notification:sent',
  ERROR: 'error',
  HEARTBEAT: 'heartbeat',
} as const;

export const ZODIAC_SIGNS = {
  ARIES: 'ARIES',
  TAURUS: 'TAURUS',
  GEMINI: 'GEMINI',
  CANCER: 'CANCER',
  LEO: 'LEO',
  VIRGO: 'VIRGO',
  LIBRA: 'LIBRA',
  SCORPIO: 'SCORPIO',
  SAGITTARIUS: 'SAGITTARIUS',
  CAPRICORN: 'CAPRICORN',
  AQUARIUS: 'AQUARIUS',
  PISCES: 'PISCES',
} as const;

export const BUSINESS_ROLES = [
  'SHOP_OWNER',
  'PAINTER',
  'SERVICE_TECH',
  'ADVISOR',
  'ESTIMATOR',
  'DETAILER',
  'WRAPPER',
] as const;

/**
 * Programmatic, non-translatable keys for system-critical stages.
 * These values MUST match the 'key' column in the 'Stage' database table.
 */
export const SYSTEM_STAGE_KEYS = {
  COMPLETED: 'COMPLETED',
} as const;