import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { LoggerService } from '../logger/logger.service';

export const CORRELATION_ID_HEADER = 'x-correlation-id';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext('CorrelationIdMiddleware');
  }
  use(req: Request, res: Response, next: NextFunction) {
    const correlationId =
      req.headers[CORRELATION_ID_HEADER]?.toString() || uuidv4();

    req['correlationId'] = correlationId;

    res.setHeader(CORRELATION_ID_HEADER, correlationId);

    this.logger.debug(
      `Request received with correlation ID: ${correlationId}`,
      {
        method: req.method,
        url: req.url,
      },
    );

    next();
  }
}
