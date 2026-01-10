import { LogContext, Logger } from './logger.service';

export class LoggerFactory {
  private static instance: Logger;

  static getInstance(context?: LogContext): Logger {
    if (!LoggerFactory.instance) {
      LoggerFactory.instance = new Logger(context);
    }
    return LoggerFactory.instance;
  }

  static createLogger(context: LogContext): Logger {
    return new Logger(context);
  }

  static reset(): void {
    LoggerFactory.instance = new Logger();
  }
}
