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
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, CurrentUser, CurrentTenant } from '@app/common';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin', 'coordinator', 'secretary')
  async findAll(@CurrentTenant() tenantId: string, @Query() query: any) {
    return this.usersService.findAll(tenantId, query);
  }

  @Get('me')
  async getProfile(@CurrentTenant() tenantId: string, @CurrentUser() user: any) {
    return this.usersService.findById(tenantId, user.sub);
  }

  @Put('me')
  async updateProfile(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: any,
    @Body() body: any,
  ) {
    return this.usersService.updateProfile(tenantId, user.sub, body);
  }

  @Get(':id')
  @Roles('admin', 'coordinator', 'secretary')
  async findOne(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.usersService.findById(tenantId, id);
  }

  @Post()
  @Roles('admin', 'secretary')
  async create(@CurrentTenant() tenantId: string, @Body() body: any) {
    return this.usersService.create({ ...body, tenantId });
  }

  @Put(':id')
  @Roles('admin', 'secretary')
  async update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.usersService.updateAdmin(tenantId, id, body);
  }

  @Delete(':id')
  @Roles('admin', 'secretary')
  async delete(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.usersService.delete(tenantId, id);
  }
}
