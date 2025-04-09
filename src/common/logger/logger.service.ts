import { Injectable, Scope } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private context?: string;

  constructor(private readonly logger: PinoLogger) {}

  setContext(context: string) {
    this.context = context;
  }

  private mergeContext(meta?: Record<string, any>): Record<string, any> {
    const logObject = { ...meta };
    if (this.context) {
      logObject['context'] = this.context;
    }
    return logObject;
  }

  debug(message: string, meta?: Record<string, any>) {
    this.logger.debug(this.mergeContext(meta), message);
  }

  info(message: string, meta?: Record<string, any>) {
    this.logger.info(this.mergeContext(meta), message);
  }

  warn(message: string, meta?: Record<string, any>) {
    this.logger.warn(this.mergeContext(meta), message);
  }

  error(message: string, error?: Error, meta?: Record<string, any>) {
    const logObject = this.mergeContext(meta);
    if (error) {
      this.logger.error({ ...logObject, err: error }, message);
    } else {
      this.logger.error(logObject, message);
    }
  }

  fatal(message: string, error?: Error, meta?: Record<string, any>) {
    const logObject = this.mergeContext(meta);
    if (error) {
      this.logger.fatal({ ...logObject, err: error }, message);
    } else {
      this.logger.fatal(logObject, message);
    }
  }
}
