import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { AuditLogService } from './services/audit-log.service';
import { InvitationService } from './services/invitation.service';
import { PasswordResetService } from './services/password-reset.service';
import { TenantsService } from '../tenants/tenants.service';
import { PublicUserDto, UsersService, UserDto } from '../users/users.service';
import { InMemoryLoginRateLimiter } from './services/login-rate-limiter.service';
import { RefreshTokenStore } from './services/refresh-token.store';
import { JwtTokenService } from './services/token.service';

export type LoginInputDto = {
  email: string;
  password: string;
  tenantSlug: string;
};

export type LoginResponseDto = {
  accessToken: string;
  refreshToken: string;
  user: PublicUserDto;
};

export type RefreshInputDto = {
  refreshToken: string;
};

export type RefreshResponseDto = {
  accessToken: string;
  refreshToken: string;
};

export type LogoutInputDto = {
  refreshToken: string;
};

export type RegisterInputDto = {
  email: string;
  password: string;
  name: string;
  inviteToken: string;
};

export type RegisterResponseDto = {
  accessToken: string;
  refreshToken: string;
  user: PublicUserDto;
};

export type ForgotPasswordInputDto = {
  email: string;
  tenantSlug: string;
};

export type ResetPasswordInputDto = {
  token: string;
  newPassword: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly tenantsService: TenantsService,
    private readonly usersService: UsersService,
    private readonly tokenService: JwtTokenService,
    private readonly rateLimiter: InMemoryLoginRateLimiter,
    private readonly refreshTokenStore: RefreshTokenStore,
    private readonly invitationService: InvitationService,
    private readonly passwordResetService: PasswordResetService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async login(
    input: LoginInputDto,
    ip?: string,
    userAgent?: string,
  ): Promise<LoginResponseDto> {
    const rateLimitKey = `${input.tenantSlug}:${input.email}`;

    if (!this.rateLimiter.isAllowed(rateLimitKey)) {
      throw new HttpException(
        'Too many login attempts',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const invalidCredentialsError = new UnauthorizedException(
      'Invalid credentials',
    );

    const tenant = await this.tenantsService.findBySlug(input.tenantSlug);
    if (!tenant) {
      this.rateLimiter.registerFailure(rateLimitKey);
      await this.auditLogService.log({
        tenantId: 'unknown',
        event: 'failed_login',
        ip,
        userAgent,
        metadata: { email: input.email, reason: 'tenant_not_found' },
      });
      throw invalidCredentialsError;
    }

    const user = await this.usersService.findByEmail(tenant.id, input.email);
    if (!user) {
      this.rateLimiter.registerFailure(rateLimitKey);
      await this.auditLogService.log({
        tenantId: tenant.id,
        event: 'failed_login',
        ip,
        userAgent,
        metadata: { email: input.email, reason: 'user_not_found' },
      });
      throw invalidCredentialsError;
    }

    if (user.status !== 'active') {
      this.rateLimiter.registerFailure(rateLimitKey);
      await this.auditLogService.log({
        tenantId: tenant.id,
        userId: user.id,
        event: 'failed_login',
        ip,
        userAgent,
        metadata: { email: input.email, reason: 'user_inactive' },
      });
      throw invalidCredentialsError;
    }

    const ok = await argon2.verify(user.passwordHash, input.password);
    if (!ok) {
      this.rateLimiter.registerFailure(rateLimitKey);
      await this.auditLogService.log({
        tenantId: tenant.id,
        userId: user.id,
        event: 'failed_login',
        ip,
        userAgent,
        metadata: { email: input.email, reason: 'invalid_password' },
      });
      throw invalidCredentialsError;
    }

    this.rateLimiter.reset(rateLimitKey);

    const accessToken = this.tokenService.generateAccessToken({
      sub: user.id,
      email: user.email,
      tenantId: tenant.id,
      role: user.role,
    });

    const refreshToken = this.tokenService.generateRefreshToken({
      sub: user.id,
      tenantId: tenant.id,
    });

    await this.refreshTokenStore.store(user.id, refreshToken, tenant.id);

    await this.auditLogService.log({
      tenantId: tenant.id,
      userId: user.id,
      event: 'login',
      ip,
      userAgent,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: tenant.id,
        avatarUrl: user.avatarUrl,
        status: user.status,
      },
    };
  }

  async refresh(input: RefreshInputDto): Promise<RefreshResponseDto> {
    const payload = this.tokenService.verifyRefreshToken(input.refreshToken);
    if (!payload) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isValid = await this.refreshTokenStore.validate(
      payload.sub,
      input.refreshToken,
    );
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findById(payload.tenantId, payload.sub);
    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('User not found or inactive');
    }

    await this.refreshTokenStore.invalidate(payload.sub, input.refreshToken);

    const accessToken = this.tokenService.generateAccessToken({
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    });

    const refreshToken = this.tokenService.generateRefreshToken({
      sub: user.id,
      tenantId: user.tenantId,
    });

    await this.refreshTokenStore.store(user.id, refreshToken, user.tenantId);

    return { accessToken, refreshToken };
  }

  async logout(input: LogoutInputDto): Promise<void> {
    const payload = this.tokenService.verifyRefreshToken(input.refreshToken);
    if (payload) {
      await this.refreshTokenStore.invalidate(payload.sub, input.refreshToken);
    }
  }

  async forgotPassword(input: ForgotPasswordInputDto): Promise<void> {
    await this.passwordResetService.requestReset(input.email, input.tenantSlug);
  }

  async resetPassword(input: ResetPasswordInputDto): Promise<void> {
    await this.passwordResetService.resetPassword(input.token, input.newPassword);
  }

  async register(input: RegisterInputDto): Promise<RegisterResponseDto> {
    const invitation = await this.invitationService.validateToken(input.inviteToken);
    if (!invitation) {
      throw new BadRequestException('Invalid or expired invitation token');
    }

    const existingUser = await this.usersService.findByEmail(
      invitation.tenantId,
      input.email,
    );
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const user = await this.usersService.create({
      tenantId: invitation.tenantId,
      email: input.email,
      password: input.password,
      name: input.name,
      role: invitation.role || 'guardian',
    });

    await this.invitationService.markAsUsed(input.inviteToken);

    const accessToken = this.tokenService.generateAccessToken({
      sub: user.id,
      email: user.email,
      tenantId: invitation.tenantId,
      role: user.role,
    });

    const refreshToken = this.tokenService.generateRefreshToken({
      sub: user.id,
      tenantId: invitation.tenantId,
    });

    await this.refreshTokenStore.store(user.id, refreshToken, invitation.tenantId);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}
