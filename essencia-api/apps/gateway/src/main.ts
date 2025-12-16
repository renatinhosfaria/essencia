import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import {
  GlobalExceptionFilter,
  LoggingInterceptor,
  TenantContextInterceptor,
} from '@app/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  
  const configService = app.get(ConfigService);
  const port = Number.parseInt(configService.get<string>('PORT') ?? '', 10) || 3000;

  // Global filters and interceptors
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new TenantContextInterceptor());

  // CORS
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', '*'),
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  await app.listen(port);
  console.log(`🚀 Gateway is running on: http://localhost:${port}/api/v1`);
}

void bootstrap();
