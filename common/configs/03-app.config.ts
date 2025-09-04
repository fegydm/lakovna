// File: common/configs/03-app.config.ts
// Last change: Added logger configuration.

import { LOG_LEVELS } from './01-constants.config';

export const APP_CONFIG = {
  appName: 'Lakovňa',
  version: '1.0.0',
  session: {
    maxAgeMs: 24 * 60 * 60 * 1000,
    cookieName: 'session_id',
  },
  websockets: {
    VEHICLE_POSITION_UPDATE: 'vehicle:position',
    VEHICLE_STATUS_CHANGE: 'vehicle:status',
    TASK_STARTED: 'task:started',
    TASK_COMPLETED: 'task:completed',
    ALERT_CREATED: 'alert:created',
  },
  workflow: {
    maxVehiclesPerStage: 10,
    tasksPerStage: 8,
    totalStages: 10,
    defaultTaskDuration: 30,
  },
  logger: {
    levels: {
      [LOG_LEVELS.DEBUG]: 0,
      [LOG_LEVELS.INFO]: 1,
      [LOG_LEVELS.WARN]: 2,
      [LOG_LEVELS.ERROR]: 3,
    },
    styles: {
      [LOG_LEVELS.DEBUG]: 'color: #888;',
      [LOG_LEVELS.INFO]: 'color: #2563eb;',
      [LOG_LEVELS.WARN]: 'color: #f59e0b;',
      [LOG_LEVELS.ERROR]: 'color: #ef4444;',
    },
  },
  technical: {
    storageKeys: {
      userRoleColors: 'user-role-colors',
      themeMode: 'theme-mode',
      pendingChanges: 'pending-changes',
    },
  },
};