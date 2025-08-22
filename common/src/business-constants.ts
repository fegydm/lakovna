// common/src/business-constants.ts
export const APP_CONFIG = {
  APP_NAME: 'Lakovňa',
  VERSION: '1.0.0',
  MAX_VEHICLES_PER_STAGE: 10,
  TASKS_PER_STAGE: 8,
  TOTAL_STAGES: 10,
  DEFAULT_TASK_DURATION: 30, // minutes
} as const;

export const STAGE_COLORS = {
  PRIMARY: '#2563eb',
  INFO: '#06b6d4',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  PURPLE: '#8b5cf6',
  ORANGE: '#f97316',
  PINK: '#ec4899'
} as const;

export const WEBSOCKET_EVENTS = {
  VEHICLE_POSITION_UPDATE: 'vehicle:position',
  VEHICLE_STATUS_CHANGE: 'vehicle:status',
  TASK_STARTED: 'task:started',
  TASK_COMPLETED: 'task:completed',
  ALERT_CREATED: 'alert:created',
} as const;