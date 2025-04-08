import { Configuration, Value } from '@itgorillaz/configify';

@Configuration()
export class ServerConfiguration {
  @Value('PORT')
  port: string;
}
