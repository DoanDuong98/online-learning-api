import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import rawBodyMiddleware from './middlewares/rawBody.middleware';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.use(rawBodyMiddleware());

  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }));

  const config_service = app.get(ConfigService);
  app.enableCors({
    origin: config_service.get('FRONTEND_URL'),
    credentials: true
  });
  await app.listen(config_service.get('PORT'), () => {
    logger.log(`Application running on port ${config_service.get('PORT')}`)
  });
}
bootstrap();
