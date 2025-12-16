import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';
import { CoreProxyController } from './proxy/core-proxy.controller';
import { EngagementProxyController } from './proxy/engagement-proxy.controller';
import { JwtAuthGuard, RolesGuard } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
  ],
  controllers: [HealthController, CoreProxyController, EngagementProxyController],
  providers: [JwtAuthGuard, RolesGuard],
})
export class GatewayModule {}
