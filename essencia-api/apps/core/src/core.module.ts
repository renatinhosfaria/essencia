import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from '@app/database';
import { CacheModule } from '@app/cache';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { StudentsModule } from './modules/students/students.module';
import { ClassesModule } from './modules/classes/classes.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    DrizzleModule,
    CacheModule,
    AuthModule,
    UsersModule,
    TenantsModule,
    StudentsModule,
    ClassesModule,
  ],
  controllers: [HealthController],
})
export class CoreModule {}
