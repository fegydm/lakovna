// File: common/utils/logger.utils.ts
// Last change: Updated config path and fixed implicit any type error.

import type { LogLevel, LogContext, LogEntry } from '../types/project.types';
import { PROJECT_CONFIG } from '../configs/project.config';

class Logger {
  private isDevelopment: boolean;
  private logLevel: LogLevel;

  constructor() {
    this.isDevelopment =
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV) ||
      process.env.NODE_ENV === 'development';

    this.logLevel = this.getLogLevel();
  }

  private getLogLevel(): LogLevel {
    let envLevel: string | undefined;

    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      envLevel = (import.meta as any).env.VITE_LOG_LEVEL;
    } else if (typeof process !== 'undefined') {
      envLevel = process.env.LOG_LEVEL;
    }

    return (envLevel as LogLevel) || (this.isDevelopment ? 'debug' : 'info');
  }

  private shouldLog(level: LogLevel): boolean {
    const minLevel = PROJECT_CONFIG.app.logger.levels[this.logLevel];
    const currentLevel = PROJECT_CONFIG.app.logger.levels[level];
    return currentLevel >= minLevel;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };
  }

  public log(level: LogLevel, message: string, context?: LogContext): void {
    if (!this.shouldLog(level)) return;

    const logEntry = this.formatMessage(level, message, context);
    const consoleMethod: 'log' | 'warn' | 'error' | 'info' = level === 'debug' ? 'log' : level;

    if (this.isDevelopment) {
      const style = PROJECT_CONFIG.app.logger.styles[level];
      console[consoleMethod](
        `%c[${level.toUpperCase()}] ${logEntry.timestamp}`,
        style,
        message,
        context ? context : ''
      );
    } else {
      console[consoleMethod](JSON.stringify(logEntry));
    }
  }

  public debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  public info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  public warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  public error(message: string, context?: LogContext): void {
    this.log('error', message, context);
  }
}

export const logger = new Logger();