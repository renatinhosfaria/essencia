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
 * Proxy controller for Engagement service (diary, messages, announcements, gallery, notifications)
 * Routes: /diary/*, /messages/*, /announcements/*, /gallery/*, /notifications/*
 */
@Controller()
export class EngagementProxyController {
  private readonly engagementServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.engagementServiceUrl = configService.get<string>(
      'ENGAGEMENT_SERVICE_URL',
      'http://localhost:3002',
    );
  }

  @All(['diary', 'diary/*path'])
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
  async proxyDiary(@Req() req: Request, @Res() res: Response) {
    return this.proxyToEngagement(req, res);
  }

  @All(['messages', 'messages/*path'])
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
  async proxyMessages(@Req() req: Request, @Res() res: Response) {
    return this.proxyToEngagement(req, res);
  }

  @All(['announcements', 'announcements/*path'])
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
  async proxyAnnouncements(@Req() req: Request, @Res() res: Response) {
    return this.proxyToEngagement(req, res);
  }

  @All(['gallery', 'gallery/*path'])
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
  async proxyGallery(@Req() req: Request, @Res() res: Response) {
    return this.proxyToEngagement(req, res);
  }

  @All(['notifications', 'notifications/*path'])
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
  async proxyNotifications(@Req() req: Request, @Res() res: Response) {
    return this.proxyToEngagement(req, res);
  }

  private async proxyToEngagement(req: Request, res: Response) {
    try {
      const tenantId =
        (req as any).tenantId || (req as any).user?.tenantId || '';
      const authHeader = req.headers.authorization || '';

      await proxyRequest({
        req,
        res,
        targetBaseUrl: this.engagementServiceUrl,
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
