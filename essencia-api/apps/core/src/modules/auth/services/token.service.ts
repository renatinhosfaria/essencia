import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

export interface AccessTokenPayload {
  sub: string;
  email: string;
  tenantId: string;
  role: string;
}

export interface RefreshTokenPayload {
  sub: string;
  tenantId: string;
}

@Injectable()
export class JwtTokenService {
  private readonly jwtPrivateKey: string;
  private readonly jwtPublicKey: string;
  private readonly jwtRefreshPrivateKey: string;
  private readonly jwtRefreshPublicKey: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor(private readonly configService: ConfigService) {
    this.jwtPrivateKey =
      configService.get<string>('JWT_PRIVATE_KEY') ||
      configService.get<string>('JWT_SECRET', 'dev-secret-key');
    this.jwtPublicKey =
      configService.get<string>('JWT_PUBLIC_KEY') ||
      configService.get<string>('JWT_SECRET', 'dev-secret-key');
    this.jwtRefreshPrivateKey =
      configService.get<string>('JWT_REFRESH_PRIVATE_KEY') ||
      configService.get<string>('JWT_REFRESH_SECRET', 'dev-refresh-secret-key');
    this.jwtRefreshPublicKey =
      configService.get<string>('JWT_REFRESH_PUBLIC_KEY') ||
      configService.get<string>('JWT_REFRESH_SECRET', 'dev-refresh-secret-key');
    this.accessTokenExpiry = configService.get<string>(
      'JWT_ACCESS_EXPIRY',
      '15m',
    );
    this.refreshTokenExpiry = configService.get<string>(
      'JWT_REFRESH_EXPIRY',
      '7d',
    );
  }

  generateAccessToken(payload: AccessTokenPayload): string {
    const isRsa = this.jwtPrivateKey.includes('BEGIN');
    return jwt.sign(payload, this.jwtPrivateKey, {
      expiresIn: this.accessTokenExpiry as jwt.SignOptions['expiresIn'],
      algorithm: isRsa ? 'RS256' : 'HS256',
    });
  }

  generateRefreshToken(payload: RefreshTokenPayload): string {
    const isRsa = this.jwtRefreshPrivateKey.includes('BEGIN');
    return jwt.sign(payload, this.jwtRefreshPrivateKey, {
      expiresIn: this.refreshTokenExpiry as jwt.SignOptions['expiresIn'],
      algorithm: isRsa ? 'RS256' : 'HS256',
    });
  }

  verifyAccessToken(token: string): AccessTokenPayload | null {
    const key = this.jwtPublicKey;
    const algorithms: jwt.Algorithm[] = key.includes('BEGIN') ? ['RS256'] : ['HS256'];
    try {
      return jwt.verify(token, key, { algorithms }) as AccessTokenPayload;
    } catch {
      return null;
    }
  }

  verifyRefreshToken(token: string): RefreshTokenPayload | null {
    const key = this.jwtRefreshPublicKey;
    const algorithms: jwt.Algorithm[] = key.includes('BEGIN') ? ['RS256'] : ['HS256'];
    try {
      return jwt.verify(token, key, { algorithms }) as RefreshTokenPayload;
    } catch {
      return null;
    }
  }
}
