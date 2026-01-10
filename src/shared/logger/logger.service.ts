export interface LogContext {
  module?: string;
  action?: string;
  userId?: string;
  companyId?: string;
  [key: string]: any;
}

export class Logger {
  private context: LogContext;

  constructor(context: LogContext = {}) {
    this.context = context;
  }

  private formatMessage(message: string, meta?: any): string {
    const contextStr = this.formatContext();
    const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
    return `${contextStr} ${message}${metaStr}`;
  }

  private formatContext(): string {
    const contextParts = [];

    if (this.context.module) {
      contextParts.push(`[${this.context.module}]`);
    }

    if (this.context.action) {
      contextParts.push(`{${this.context.action}}`);
    }

    if (this.context.companyId) {
      contextParts.push(`company:${this.context.companyId}`);
    }

    if (this.context.userId) {
      contextParts.push(`user:${this.context.userId}`);
    }

    return contextParts.join(' ');
  }

  info(message: string, meta?: any): void {
    console.log(`[INFO] ${this.formatMessage(message, meta)}`);
  }

  debug(message: string, meta?: any): void {
    console.debug(`[DEBUG] ${this.formatMessage(message, meta)}`);
  }

  warn(message: string, meta?: any): void {
    console.warn(`[WARN] ${this.formatMessage(message, meta)}`);
  }

  error(message: string, error?: Error | any, meta?: any): void {
    const errorInfo = error instanceof Error ? error.message : String(error);
    console.error(`[ERROR] ${this.formatMessage(message, { error: errorInfo, ...meta })}`);
  }

  success(message: string, meta?: any): void {
    console.log(`[SUCCESS] ${this.formatMessage(message, meta)}`);
  }

  setContext(context: LogContext): void {
    this.context = { ...this.context, ...context };
  }

  child(childContext: LogContext): Logger {
    return new Logger({ ...this.context, ...childContext });
  }
}
