import { Configuration, Value } from '@itgorillaz/configify';

@Configuration()
export class JWTConfiguration {
  @Value('JWT_SECRET')
  jwtSecret: string;
  @Value('JWT_EXPIRATION_TIME')
  jwtExpirationTime: number;
}
