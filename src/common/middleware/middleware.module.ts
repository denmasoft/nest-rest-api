import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CorrelationIdMiddleware } from './correlation-id.middleware';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [LoggerModule],
})
export class MiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
