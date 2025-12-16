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
import { AnnouncementsService } from './announcements.service';
import {
  CurrentTenant,
  CurrentUser,
  JwtAuthGuard,
  Roles,
  RolesGuard,
} from '@app/common';
import { UserPayload } from '@app/common';

@Controller('announcements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

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
    @CurrentUser() user: UserPayload,
    @Query() query: any,
  ) {
    return this.announcementsService.findAll(tenantId, user, query);
  }

  @Get(':id')
  @Roles(
    'admin',
    'coordinator',
    'secretary',
    'teacher',
    'guardian',
    'guardian_primary',
    'guardian_secondary',
  )
  async findOne(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    return this.announcementsService.findById(tenantId, id, user);
  }

  @Post()
  @Roles('admin', 'coordinator', 'secretary')
  async create(
    @CurrentTenant() tenantId: string,
    @CurrentUser('sub') userId: string,
    @Body() body: any,
  ) {
    return this.announcementsService.create(tenantId, userId, body);
  }

  @Put(':id')
  @Roles('admin', 'coordinator', 'secretary')
  async update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.announcementsService.update(tenantId, id, body);
  }

  @Delete(':id')
  @Roles('admin', 'coordinator', 'secretary')
  async delete(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.announcementsService.delete(tenantId, id);
  }

  @Post(':id/read')
  @Roles(
    'admin',
    'coordinator',
    'secretary',
    'teacher',
    'guardian',
    'guardian_primary',
    'guardian_secondary',
  )
  async markAsRead(
    @CurrentTenant() tenantId: string,
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    return this.announcementsService.markAsRead(tenantId, id, userId);
  }
}
