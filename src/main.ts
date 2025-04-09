import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { CorsConfiguration } from './config/cors.configuration';
import { ServerConfiguration } from './config/server.configuration';
import { getCorsOptions } from './config/cors/cors.options';
import { Logger } from 'nestjs-pino';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const appOptions = { cors: true };
  const app = await NestFactory.create(AppModule, appOptions);
  const logger = app.get(Logger);
  app.useLogger(logger);
  logger.log('dfdfdfdf');
  app.setGlobalPrefix('api');

  app.use(helmet());

  const corsConfiguration = app.get(CorsConfiguration);

  const serverConfiguration = app.get(ServerConfiguration);

  const corsOptions = getCorsOptions(corsConfiguration);

  if (corsOptions) {
    app.enableCors(corsOptions);
    logger.log('CORS enabled.');
  }

  const options = new DocumentBuilder()
    .setTitle('Nest resst api')
    .setDescription('Nest rest api description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);
  const port = serverConfiguration.port;
  await app.listen(port);
}

bootstrap();
