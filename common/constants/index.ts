// common/constants/index.ts
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

export const DEFAULT_STAGES = [
  { name: 'Príjem', icon: '📋', color: STAGE_COLORS.PRIMARY, sequence: 1 },
  { name: 'Umytie', icon: '🚿', color: STAGE_COLORS.INFO, sequence: 2 },
  { name: 'Fotodokumentácia', icon: '📷', color: STAGE_COLORS.PURPLE, sequence: 3 },
  { name: 'Diagnostika', icon: '🔍', color: STAGE_COLORS.WARNING, sequence: 4 },
  { name: 'Plánovanie', icon: '📊', color: STAGE_COLORS.ORANGE, sequence: 5 },
  { name: 'Príprava', icon: '🛠️', color: STAGE_COLORS.PINK, sequence: 6 },
  { name: 'Lakovanie', icon: '🎨', color: STAGE_COLORS.ERROR, sequence: 7 },
  { name: 'Kompletizácia', icon: '⚙️', color: STAGE_COLORS.SUCCESS, sequence: 8 },
  { name: 'Kontrola', icon: '✅', color: STAGE_COLORS.INFO, sequence: 9 },
  { name: 'Odovzdanie', icon: '🚗', color: STAGE_COLORS.PRIMARY, sequence: 10 }
] as const;

export const WEBSOCKET_EVENTS = {
  // Vehicle events
  VEHICLE_POSITION_UPDATE: 'vehicle:position',
  VEHICLE_STATUS_CHANGE: 'vehicle:status',
  VEHICLE_STAGE_CHANGE: 'vehicle:stage',
  
  // Task events
  TASK_STARTED: 'task:started',
  TASK_COMPLETED: 'task:completed',
  TASK_DELAYED: 'task:delayed',
  
  // Stage events
  STAGE_STATUS_CHANGE: 'stage:status',
  
  // System events
  ALERT_CREATED: 'alert:created',
  NOTIFICATION_SEND: 'notification:send'
} as const;