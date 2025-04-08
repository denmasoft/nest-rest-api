import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { LoggerService } from './logger.service';
import { LoggerConfiguration } from 'src/config/logger.configuration';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [LoggerConfiguration],
      useFactory: async (loggerConfiguration: LoggerConfiguration) => ({
        pinoHttp: {
          level: loggerConfiguration.level,
          transport: {
            target: 'pino-pretty',
            options: {
              messageKey: 'message',
              colorize: true,
              levelFirst: true,
              translateTime: 'SYS:standard',
              messageFormat: '(correlationId={correlationId}) {context} {msg}',
            },
          },
          autoLogging: true,
          messageKey: 'message',
          serializers: {
            req(req) {
              req.body = req.raw.body;
              return req;
            },
            res(res) {
              return res;
            },
          },
        },
      }),
    }),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
