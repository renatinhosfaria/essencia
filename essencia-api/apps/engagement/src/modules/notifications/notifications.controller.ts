import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import {
  CurrentTenant,
  CurrentUser,
  JwtAuthGuard,
  Roles,
  RolesGuard,
} from '@app/common';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Roles(
    'admin',
    'coordinator',
    'secretary',
    'teacher',
    'guardian',
    'guardian_primary',
    'guardian_secondary',
  )
  async findAll(
    @CurrentTenant() tenantId: string,
    @CurrentUser('sub') userId: string,
    @Query() query: any,
  ) {
    return this.notificationsService.findAll(tenantId, userId, query);
  }

  @Post('device-token')
  @Roles(
    'admin',
    'coordinator',
    'secretary',
    'teacher',
    'guardian',
    'guardian_primary',
    'guardian_secondary',
  )
  async registerDeviceToken(
    @CurrentTenant() tenantId: string,
    @CurrentUser('sub') userId: string,
    @Body()
    body: {
      token: string;
      platform: 'ios' | 'android' | 'web';
      deviceId: string;
      deviceName?: string;
    },
  ) {
    return this.notificationsService.registerDeviceToken(tenantId, userId, body);
  }

  @Delete('device-token/:deviceId')
  @Roles(
    'admin',
    'coordinator',
    'secretary',
    'teacher',
    'guardian',
    'guardian_primary',
    'guardian_secondary',
  )
  async removeDeviceToken(
    @CurrentTenant() tenantId: string,
    @CurrentUser('sub') userId: string,
    @Param('deviceId') deviceId: string,
  ) {
    return this.notificationsService.removeDeviceToken(tenantId, userId, deviceId);
  }

  @Post('send')
  @Roles('admin', 'coordinator')
  async sendNotification(
    @CurrentTenant() tenantId: string,
    @Body()
    body: {
      userId: string;
      title: string;
      body: string;
      data?: Record<string, unknown>;
    },
  ) {
    return this.notificationsService.queueNotification(tenantId, body);
  }
}
