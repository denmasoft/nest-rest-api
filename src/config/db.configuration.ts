import { Configuration, Value } from '@itgorillaz/configify';

@Configuration()
export class DBConfiguration {
  @Value('DATABASE_URL')
  url: string;
}
