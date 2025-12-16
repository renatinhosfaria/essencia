import {
  CurrentTenant,
  CurrentUser,
  JwtAuthGuard,
  Roles,
  RolesGuard,
} from '@app/common';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GalleryService } from './gallery.service';

@Controller('gallery')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

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
  async findAll(@CurrentTenant() tenantId: string, @Query() query: any) {
    return this.galleryService.findAll(tenantId, query);
  }

  @Get('class/:classId')
  @Roles(
    'admin',
    'coordinator',
    'secretary',
    'teacher',
    'guardian',
    'guardian_primary',
    'guardian_secondary',
  )
  async findByClass(
    @CurrentTenant() tenantId: string,
    @Param('classId') classId: string,
    @Query() query: any,
  ) {
    return this.galleryService.findByClass(tenantId, classId, query);
  }

  @Get('student/:studentId')
  @Roles(
    'admin',
    'coordinator',
    'secretary',
    'teacher',
    'guardian',
    'guardian_primary',
    'guardian_secondary',
  )
  async findByStudent(
    @CurrentTenant() tenantId: string,
    @Param('studentId') studentId: string,
    @Query() query: any,
    @CurrentUser('sub') userId: string,
    @CurrentUser() user: any,
  ) {
    // FR17-18: Guardians can only see gallery of their own children
    if (user.role.includes('guardian')) {
      const hasAccess = await this.galleryService.verifyGuardianAccess(
        tenantId,
        userId,
        studentId,
      );

      if (!hasAccess) {
        throw new ForbiddenException(
          'Acesso negado. Você só pode ver galeria dos seus filhos.',
        );
      }
    }

    return this.galleryService.findByStudent(tenantId, studentId, query);
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
  async findOne(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.galleryService.findById(tenantId, id);
  }

  @Post()
  @Roles('admin', 'coordinator', 'secretary', 'teacher')
  @UseInterceptors(FilesInterceptor('files', 10))
  async create(
    @CurrentTenant() tenantId: string,
    @CurrentUser('sub') userId: string,
    @Body() body: any,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.galleryService.create(tenantId, userId, body, files);
  }

  @Put(':id')
  @Roles('admin', 'coordinator', 'secretary', 'teacher')
  async update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.galleryService.update(tenantId, id, body);
  }

  @Delete(':id')
  @Roles('admin', 'coordinator', 'secretary', 'teacher')
  async delete(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.galleryService.delete(tenantId, id);
  }

  @Post(':id/tag-students')
  @Roles('admin', 'coordinator', 'secretary', 'teacher')
  async tagStudents(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() body: { studentIds: string[] },
  ) {
    return this.galleryService.tagStudents(tenantId, id, body.studentIds);
  }
}
