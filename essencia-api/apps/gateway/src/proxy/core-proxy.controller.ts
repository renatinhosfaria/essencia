import { JwtAuthGuard, Roles, RolesGuard } from '@app/common';
import {
  All,
  Controller,
  HttpException,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { proxyRequest } from './proxy-request';

/**
 * Proxy controller for Core service (auth, users, tenants, students, classes)
 * Routes: /auth/*, /users/*, /tenants/*, /students/*, /classes/*
 */
@Controller()
export class CoreProxyController {
  private readonly coreServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.coreServiceUrl = configService.get<string>(
      'CORE_SERVICE_URL',
      'http://localhost:3001',
    );
  }

  @All(['auth', 'auth/*path'])
  async proxyAuth(@Req() req: Request, @Res() res: Response) {
    return this.proxyToCore(req, res);
  }

  @All(['users/me', 'users/me/*path'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    'admin',
    'coordinator',
    'secretary',
    'teacher',
    'guardian',
    'guardian_primary',
    'guardian_secondary',
  )
  async proxyUsersMe(@Req() req: Request, @Res() res: Response) {
    return this.proxyToCore(req, res);
  }

  @All(['users', 'users/*path'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'coordinator', 'secretary')
  async proxyUsers(@Req() req: Request, @Res() res: Response) {
    return this.proxyToCore(req, res);
  }

  @All(['tenants/by-slug', 'tenants/by-slug/*path'])
  async proxyTenantsBySlug(@Req() req: Request, @Res() res: Response) {
    return this.proxyToCore(req, res);
  }

  @All(['tenants', 'tenants/*path'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async proxyTenants(@Req() req: Request, @Res() res: Response) {
    return this.proxyToCore(req, res);
  }

  @All(['students', 'students/*path'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    'admin',
    'coordinator',
    'secretary',
    'teacher',
    'guardian',
    'guardian_primary',
    'guardian_secondary',
  )
  async proxyStudents(@Req() req: Request, @Res() res: Response) {
    return this.proxyToCore(req, res);
  }

  @All(['classes', 'classes/*path'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'coordinator', 'secretary', 'teacher')
  async proxyClasses(@Req() req: Request, @Res() res: Response) {
    return this.proxyToCore(req, res);
  }

  private async proxyToCore(req: Request, res: Response) {
    try {
      const tenantId =
        (req as any).tenantId || (req as any).user?.tenantId || '';
      const authHeader = req.headers.authorization || '';

      await proxyRequest({
        req,
        res,
        targetBaseUrl: this.coreServiceUrl,
        additionalHeaders: {
          authorization: authHeader as string,
          'x-tenant-id': tenantId,
        },
      });
    } catch (error) {
      throw new HttpException('Service unavailable', 503);
    }
  }
}
