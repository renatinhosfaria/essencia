import { NestFactory } from '@nestjs/core';
import { CoreModule } from './core.module';
import {
  GlobalExceptionFilter,
  LoggingInterceptor,
  TenantContextInterceptor,
  TransformInterceptor,
} from '@app/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);
  
  const configService = app.get(ConfigService);
  const port =
    Number.parseInt(configService.get<string>('PORT') ?? '', 10) ||
    Number.parseInt(configService.get<string>('CORE_PORT') ?? '', 10) ||
    3001;

  // Global filters and interceptors
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TenantContextInterceptor(),
    new TransformInterceptor(),
  );

  // CORS
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', '*'),
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  await app.listen(port);
  console.log(`🔐 Core Service is running on: http://localhost:${port}/api/v1`);
}

void bootstrap();
