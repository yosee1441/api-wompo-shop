import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import {
  HttpExceptionFilter,
  ResponseInterceptor,
  envs,
  validationExceptionFactory,
} from '@/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Main WOMPO SHOP');
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const options = new DocumentBuilder()
    .setTitle('WOMPO SHOP API')
    .setDescription('WOMPO SHOP API for all rest full')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(envs.port);
  logger.log(`WOMPO SHOP running on port ${envs.port}`);
}

bootstrap();
