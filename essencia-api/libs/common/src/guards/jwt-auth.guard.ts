import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { UserPayload } from '../types/user-payload.type';

/**
  * Simple JWT access guard shared across services.
  * - Expects "Authorization: Bearer <token>"
  * - Uses JWT_SECRET to verify the token
  * - Attaches user payload and tenantId to request
  */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly jwtSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET', 'dev-secret-key');
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const path: string = request.originalUrl || request.url || '';

    // Allow unauthenticated access for login/refresh routes
    const isAuthPublic = /^\/?api\/v1\/auth\/(login|refresh)/.test(path) || /^\/?auth\/(login|refresh)/.test(path);
    if (isAuthPublic) {
      return true;
    }

    const authHeader = request.headers.authorization as string | undefined;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.slice(7);
    const publicKey =
      this.configService.get<string>('JWT_PUBLIC_KEY') ||
      this.configService.get<string>('JWT_SECRET', 'dev-secret-key');
    const algorithms: jwt.Algorithm[] = publicKey.includes('BEGIN')
      ? ['RS256']
      : ['HS256'];

    try {
      const payload = jwt.verify(token, publicKey, { algorithms }) as UserPayload;

      if (!payload?.tenantId) {
        throw new UnauthorizedException('Invalid token payload');
      }

      request.user = payload;
      request.tenantId = payload.tenantId;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
