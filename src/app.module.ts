import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  ThrottlerModule,
  ThrottlerGuard,
  ThrottlerOptions,
} from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PassportAuthGuard } from './auth/guards/passport/auth.guard';
import { ConfigifyModule } from '@itgorillaz/configify';
import { RateLimitingConfiguration } from './config/rate.limiting.configuration';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { MiddlewareModule } from './common/middleware/middleware.module';
import { LoggerModule } from './common/logger/logger.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigifyModule.forRootAsync(),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [RateLimitingConfiguration],
      useFactory: (
        rateLimitingConfig: RateLimitingConfiguration,
      ): ThrottlerOptions[] => [
        {
          ttl: rateLimitingConfig.throttleLimit,
          limit: rateLimitingConfig.throttleLimit,
        },
      ],
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    MiddlewareModule,
    LoggerModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: PassportAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
