import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBConfiguration } from 'src/config/db.configuration';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (dbConfiguration: DBConfiguration) => ({
        type: 'mongodb',
        url: dbConfiguration.url,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false,
        autoLoadEntities: true,
        retryAttempts: 5,
        retryDelay: 1000,
        logger: 'simple-console',
        poolSize: 10,
        authSource: 'admin',
        retryWrites: true,
      }),
      inject: [DBConfiguration],
    }),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
