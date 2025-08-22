// logger/src/core-logger.ts
import { LogLevel } from './log-levels.js';          
import { getEnvVariable, getLogLevelValue } from './env-helpers.js';

// Determine current environment and log level
const currentEnvironment = getEnvVariable('NODE_ENV', 'development');
const defaultLevel = currentEnvironment === 'production' ? 'info' : 'debug';
const logLevelEnv = getEnvVariable('LOG_LEVEL', defaultLevel);
const currentLogLevel = getLogLevelValue(logLevelEnv);

// Timestamp helper
const getTimestamp = (): string => new Date().toISOString();

// Logger implementation
export const logger = {
  error: (message: string, ...meta: any[]): void => {
    if (currentLogLevel >= LogLevel.ERROR) {
      console.error(`[${getTimestamp()}] [ERROR] [LAKOVNA] ${message}`, ...meta);
    }
  },

  warn: (message: string, ...meta: any[]): void => {
    if (currentLogLevel >= LogLevel.WARN) {
      console.warn(`[${getTimestamp()}] [WARN] [LAKOVNA] ${message}`, ...meta);
    }
  },

  info: (message: string, ...meta: any[]): void => {
    if (currentLogLevel >= LogLevel.INFO) {
      console.info(`[${getTimestamp()}] [INFO] [LAKOVNA] ${message}`, ...meta);
    }
  },

  debug: (message: string, ...meta: any[]): void => {
    if (currentLogLevel >= LogLevel.DEBUG) {
      console.debug(`[${getTimestamp()}] [DEBUG] [LAKOVNA] ${message}`, ...meta);
    }
  },

  log: (level: LogLevel, message: string, ...meta: any[]): void => {
    if (level <= currentLogLevel) {
      const levelName = LogLevel[level];
      console.log(`[${getTimestamp()}] [${levelName}] [LAKOVNA] ${message}`, ...meta);
    }
  },
};

export default logger;
export { LogLevel } from './log-levels.js';
export { getEnvVariable } from './env-helpers.js';