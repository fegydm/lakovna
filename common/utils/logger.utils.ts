// File: common/utils/logger.utils.ts
// Last change: Refactored logger to be universal and independent of runtime environments

import type { LogLevel, LogContext, LogEntry } from '../types/logger.types';
import { LOGGER_CONFIG } from '../configs/logger.config';

class Logger {
  private is_development: boolean;
  private log_level: LogLevel;

  constructor() {
    this.is_development =
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV) ||
      process.env.NODE_ENV === 'development';

    this.log_level = this.get_log_level();
  }

  private get_log_level(): LogLevel {
    let env_level: string | undefined;

    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      env_level = (import.meta as any).env.VITE_LOG_LEVEL;
    } else if (typeof process !== 'undefined') {
      env_level = process.env.LOG_LEVEL;
    }

    return (env_level as LogLevel) || (this.is_development ? 'debug' : 'info');
  }

  private should_log(level: LogLevel): boolean {
    return LOGGER_CONFIG.log_levels[level] >= LOGGER_CONFIG.log_levels[this.log_level];
  }

  private format_message(level: LogLevel, message: string, context?: LogContext): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };
  }

  public log(level: LogLevel, message: string, context?: LogContext): void {
    if (!this.should_log(level)) return;

    const log_entry = this.format_message(level, message, context);
    const console_method = level === 'debug' ? 'log' : level;

    if (this.is_development) {
      const style = LOGGER_CONFIG.dev_styles[level];
      console[console_method](
        `%c[${level.toUpperCase()}] ${log_entry.timestamp}`,
        style,
        message,
        context ? context : ''
      );
    } else {
      console[console_method](JSON.stringify(log_entry));
    }

    // This part should be moved to a specific server/client implementation
    // this.send_to_server(log_entry);
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