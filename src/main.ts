import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ExceptionsLoggerFilter } from './utils/exceptionsLogger.filter';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new ExceptionsLoggerFilter(httpAdapter));

  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }))

  const config_service = app.get(ConfigService);
  await app.listen(config_service.get('PORT'), () => {
    logger.log(`Application running on port ${config_service.get('PORT')}`)
  });
}
bootstrap();
