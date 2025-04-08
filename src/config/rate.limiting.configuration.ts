import { Configuration, Value } from '@itgorillaz/configify';

@Configuration()
export class RateLimitingConfiguration {
  @Value('THROTTLE_TTL')
  throttleTTL: number;
  @Value('THROTTLE_LIMIT')
  throttleLimit: number;
}
