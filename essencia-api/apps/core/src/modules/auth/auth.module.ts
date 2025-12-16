import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TenantsModule } from '../tenants/tenants.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuditLogService } from './services/audit-log.service';
import { EmailService } from './services/email.service';
import { InvitationService } from './services/invitation.service';
import { InMemoryLoginRateLimiter } from './services/login-rate-limiter.service';
import { PasswordResetService } from './services/password-reset.service';
import { RefreshTokenStore } from './services/refresh-token.store';
import { JwtTokenService } from './services/token.service';

@Module({
  imports: [ConfigModule, forwardRef(() => UsersModule), TenantsModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtTokenService,
    RefreshTokenStore,
    InMemoryLoginRateLimiter,
    InvitationService,
    PasswordResetService,
    AuditLogService,
    EmailService,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [AuthService, JwtTokenService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
