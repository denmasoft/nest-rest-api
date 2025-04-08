import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guards/passport/strategies/jwt.strategy';
import { ConfigifyModule } from '@itgorillaz/configify';
import { JWTConfiguration } from 'src/config/jwt.configuration';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigifyModule,
    JwtModule.registerAsync({
      imports: [ConfigifyModule],
      useFactory: async (jwtConfiguration: JWTConfiguration) => ({
        secret: jwtConfiguration.jwtSecret,
        signOptions: {
          expiresIn: jwtConfiguration.jwtExpirationTime,
        },
      }),
      inject: [JWTConfiguration],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
