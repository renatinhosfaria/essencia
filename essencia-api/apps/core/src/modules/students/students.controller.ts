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
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, CurrentTenant, CurrentUser } from '@app/common';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @Roles('admin', 'coordinator', 'secretary', 'teacher')
  async findAll(@CurrentTenant() tenantId: string, @Query() query: any) {
    return this.studentsService.findAll(tenantId, query);
  }

  @Get('my-children')
  @Roles('guardian', 'guardian_primary', 'guardian_secondary')
  async findMyChildren(
    @CurrentTenant() tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.studentsService.findByGuardian(tenantId, userId);
  }

  @Get(':id')
  @Roles('admin', 'coordinator', 'secretary', 'teacher')
  async findOne(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.studentsService.findById(tenantId, id);
  }

  @Post()
  @Roles('admin', 'coordinator', 'teacher')
  async create(@CurrentTenant() tenantId: string, @Body() body: any) {
    return this.studentsService.create(tenantId, body);
  }

  @Put(':id')
  @Roles('admin', 'coordinator', 'teacher')
  async update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.studentsService.update(tenantId, id, body);
  }

  @Delete(':id')
  @Roles('admin', 'coordinator')
  async delete(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.studentsService.delete(tenantId, id);
  }
}
