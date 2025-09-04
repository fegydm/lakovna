// File: common/types/logger.types.ts
// Last change: Created universal types for the logger utility

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