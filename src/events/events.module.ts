import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';
import { LoggerModule } from '../common/logger/logger.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [LoggerModule, ConfigModule],
  providers: [EventsGateway, EventsService],
  exports: [EventsService],
})
export class EventsModule {}
