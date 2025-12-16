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
import { ClassesService } from './classes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, CurrentTenant } from '@app/common';

@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  @Roles('admin', 'coordinator', 'secretary', 'teacher')
  async findAll(@CurrentTenant() tenantId: string, @Query() query: any) {
    return this.classesService.findAll(tenantId, query);
  }

  @Get(':id')
  @Roles('admin', 'coordinator', 'secretary', 'teacher')
  async findOne(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.classesService.findById(tenantId, id);
  }

  @Get(':id/students')
  @Roles('admin', 'coordinator', 'secretary', 'teacher')
  async getStudents(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.classesService.getStudents(tenantId, id);
  }

  @Post()
  @Roles('admin', 'coordinator')
  async create(@CurrentTenant() tenantId: string, @Body() body: any) {
    return this.classesService.create(tenantId, body);
  }

  @Put(':id')
  @Roles('admin', 'coordinator')
  async update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.classesService.update(tenantId, id, body);
  }

  @Delete(':id')
  @Roles('admin', 'coordinator')
  async delete(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.classesService.delete(tenantId, id);
  }
}
