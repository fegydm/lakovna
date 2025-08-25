// logger/src/env-helpers.ts  
import { LogLevel } from './log-levels.js';           // ✅ Import LogLevel

export const getEnvVariable = (key: string, fallback: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key]!;
  }
  if (typeof globalThis !== 'undefined' && (globalThis as any)[key]) {
    return (globalThis as any)[key];
  }
  return fallback;
};

export const getLogLevelValue = (level: string): LogLevel => {
  switch (level.toLowerCase()) {
    case 'error': return LogLevel.ERROR;
    case 'warn': return LogLevel.WARN;
    case 'info': return LogLevel.INFO;
    case 'debug': return LogLevel.DEBUG;
    default: return LogLevel.INFO;
  }
};