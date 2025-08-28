// File: front/src/libs/utils/logger.util.ts

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  url?: string;
  userAgent?: string;
}

class Logger {
  private isDevelopment: boolean;
  private logLevel: LogLevel;

  constructor() {
    this.isDevelopment = import.meta.env.DEV || false;
    this.logLevel = this.getLogLevel();
  }

  private getLogLevel(): LogLevel {
    const envLevel = import.meta.env.VITE_LOG_LEVEL as LogLevel;
    return envLevel || (this.isDevelopment ? 'debug' : 'info');
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    return levels[level] >= levels[this.logLevel];
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      url: window.location.href,
      userAgent: navigator.userAgent
    };
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    if (!this.shouldLog(level)) return;

    const logEntry = this.formatMessage(level, message, context);
    const consoleMethod = level === 'debug' ? 'log' : level;

    if (this.isDevelopment) {
      const style = this.getConsoleStyle(level);
      console[consoleMethod](
        `%c[${level.toUpperCase()}] ${logEntry.timestamp}`,
        style,
        message,
        context ? context : ''
      );
    } else {
      console[consoleMethod](JSON.stringify(logEntry));
    }

    this.sendToServer(logEntry);
  }

  private getConsoleStyle(level: LogLevel): string {
    const styles = {
      debug: 'color: #6b7280; font-weight: normal;',
      info: 'color: #3b82f6; font-weight: bold;',
      warn: 'color: #f59e0b; font-weight: bold;',
      error: 'color: #ef4444; font-weight: bold; background: #fef2f2; padding: 2px 4px; border-radius: 3px;'
    };
    return styles[level];
  }

  private async sendToServer(logEntry: LogEntry): Promise<void> {
    if (this.isDevelopment || logEntry.level === 'debug') return;

    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry),
        keepalive: true
      });
    } catch (error) {
      console.error('Failed to send log to server:', error);
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext): void {
    this.log('error', message, context);
  }

  group(label: string): void {
    if (this.isDevelopment) {
      console.group(`🏭 ${label}`);
    }
  }

  groupEnd(): void {
    if (this.isDevelopment) {
      console.groupEnd();
    }
  }

  time(label: string): void {
    if (this.isDevelopment) {
      console.time(`⏱️ ${label}`);
    }
  }

  timeEnd(label: string): void {
    if (this.isDevelopment) {
      console.timeEnd(`⏱️ ${label}`);
    }
  }
}

export const logger = new Logger();