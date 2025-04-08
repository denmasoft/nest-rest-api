import { Configuration, Value } from '@itgorillaz/configify';

const toBoolean = (value: string) => ['1', 'true'].includes(value);

@Configuration()
export class CorsConfiguration {
  @Value('CORS_ORIGIN')
  origin: string;
  @Value('CORS_METHODS')
  methods: string;
  @Value('CORS_CREDENTIALS', { parse: toBoolean })
  credentials: boolean;
  @Value('ALLOW_HEADERS')
  headers: any;
  @Value('MAX_AGE')
  maxAge: number;
}
