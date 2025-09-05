// File: common/utils/logger.utils.ts
// Last change: Final version with all conventions, SSoT, and type-safety features.

import type { LogLevel, LogContext, LogEntry, ConsoleMethod } from '../types/shared.types';
import { APP_CONFIG } from '../configs/03-app.config';
import { LOG_LEVELS } from '../configs/01-constants.config';

class Logger {
  private readonly isDevelopment: boolean;
  private readonly logLevel: LogLevel;
  private readonly logLevels: Record<LogLevel, number>;

  constructor() {
    this.isDevelopment =
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV) ||
      process.env.NODE_ENV === 'development';
    
    this.logLevels = APP_CONFIG.logger.levels;
    this.logLevel = this.getLogLevelFromEnv();
  }

  /** Checks if a string is a valid LogLevel. */
  private isValidLogLevel = (level: string): level is LogLevel => {
    return Object.values(LOG_LEVELS).includes(level as any);
  };

  private getLogLevelFromEnv(): LogLevel {
    let envLevel: string | undefined;

    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      envLevel = (import.meta as any).env.VITE_LOG_LEVEL;
    } else if (typeof process !== 'undefined') {
      envLevel = process.env.LOG_LEVEL;
    }
    
    const upperEnvLevel = envLevel?.toUpperCase();

    if (upperEnvLevel && this.isValidLogLevel(upperEnvLevel)) {
      return upperEnvLevel;
    }

    return this.isDevelopment ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;
  }

  private shouldLog(level: LogLevel): boolean {
    const minLevelValue = this.logLevels[this.logLevel];
    const currentLevelValue = this.logLevels[level];
    return currentLevelValue >= minLevelValue;
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
    const consoleMethod: ConsoleMethod = APP_CONFIG.logger.consoleMethods[level];

    if (this.isDevelopment) {
      const style = APP_CONFIG.logger.styles[level];
      console[consoleMethod](
        `%c[${level}] ${logEntry.timestamp}`,
        style,
        message,
        context ?? ''
      );
    } else {
      console[consoleMethod](JSON.stringify(logEntry));
    }
  }

  public debug(message: string, context?: LogContext): void {
    this.log(LOG_LEVELS.DEBUG, message, context);
  }

  public info(message: string, context?: LogContext): void {
    this.log(LOG_LEVELS.INFO, message, context);
  }

  public warn(message: string, context?: LogContext): void {
    this.log(LOG_LEVELS.WARN, message, context);
  }

  public error(message: string, context?: LogContext): void {
    this.log(LOG_LEVELS.ERROR, message, context);
  }
}

export const logger = new Logger();