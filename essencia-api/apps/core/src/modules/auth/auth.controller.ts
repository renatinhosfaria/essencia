import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService, LoginResponseDto, RefreshResponseDto } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

type LoginBody = {
  email: string;
  password: string;
  tenantSlug: string;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function parseLoginBody(raw: unknown): LoginBody {
  if (typeof raw !== 'object' || raw === null) {
    throw new BadRequestException('Invalid request body');
  }

  const record = raw as Record<string, unknown>;
  const emailRaw = record.email;
  const passwordRaw = record.password;
  const tenantSlugRaw = record.tenantSlug;

  if (!isNonEmptyString(emailRaw) || !isValidEmail(emailRaw.trim())) {
    throw new BadRequestException('Invalid email');
  }

  if (!isNonEmptyString(passwordRaw)) {
    throw new BadRequestException('Invalid password');
  }

  if (!isNonEmptyString(tenantSlugRaw)) {
    throw new BadRequestException('Invalid tenantSlug');
  }

  return {
    email: emailRaw.trim().toLowerCase(),
    password: passwordRaw,
    tenantSlug: tenantSlugRaw.trim(),
  };
}

type RefreshBody = {
  refreshToken: string;
};

function parseRefreshBody(raw: unknown): RefreshBody {
  if (typeof raw !== 'object' || raw === null) {
    throw new BadRequestException('Invalid request body');
  }

  const record = raw as Record<string, unknown>;
  const refreshTokenRaw = record.refreshToken;

  if (!isNonEmptyString(refreshTokenRaw)) {
    throw new BadRequestException('Invalid refreshToken');
  }

  return {
    refreshToken: refreshTokenRaw.trim(),
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: unknown,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ): Promise<LoginResponseDto> {
    const input = parseLoginBody(body);
    return this.authService.login(input, ip, userAgent);
  }

  @Post('refresh')
  async refresh(@Body() body: unknown): Promise<RefreshResponseDto> {
    const input = parseRefreshBody(body);
    return this.authService.refresh(input);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body() body: unknown): Promise<void> {
    const input = parseRefreshBody(body);
    await this.authService.logout(input);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Request() req: any) {
    return req.user;
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: { email: string; tenantSlug: string }) {
    throw new BadRequestException(
      'Recuperação de senha deve ser solicitada diretamente à escola (self-service desabilitado).',
    );
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    throw new BadRequestException(
      'Recuperação de senha deve ser solicitada diretamente à escola (self-service desabilitado).',
    );
  }

  @Post('register')
  async register(@Body() body: {
    email: string;
    password: string;
    name: string;
    inviteToken: string;
  }) {
    throw new BadRequestException(
      'Registro self-service desabilitado. Solicite convite à secretaria.',
    );
  }
}
