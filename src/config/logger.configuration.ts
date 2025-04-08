import { Configuration, Value } from '@itgorillaz/configify';

@Configuration()
export class LoggerConfiguration {
  @Value('LOG_LEVEL')
  level: string;
}
