import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { CorsConfiguration } from '../cors.configuration';

export function getCorsOptions(
  corsConfiguration: CorsConfiguration,
): CorsOptions | undefined {
  const corsOrigin = corsConfiguration.origin;
  const corsMethods = corsConfiguration.methods;
  const corsCredentials = corsConfiguration.credentials;
  const corsHeaders = corsConfiguration.headers;
  const maxAge = corsConfiguration.maxAge;

  const corsOptions: CorsOptions = {
    origin: corsOrigin.split(',').map((origin) => origin.trim()),
    methods: corsMethods,
    credentials: corsCredentials,
    allowedHeaders: corsHeaders.split(',').map((header) => header.trim()),
    maxAge: maxAge,
  };

  return corsOptions;
}
