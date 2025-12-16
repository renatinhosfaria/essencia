import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import {
  CurrentTenant,
  CurrentUser,
  JwtAuthGuard,
  Roles,
  RolesGuard,
} from '@app/common';
import { UserPayload } from '@app/common';

@Controller('diary')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Get()
  @Roles('admin', 'coordinator', 'secretary', 'teacher')
  async findAll(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: UserPayload,
    @Query() query: any,
  ) {
    return this.diaryService.findAll(tenantId, user, query);
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
    @CurrentUser() user: UserPayload,
  ) {
    return this.diaryService.findByStudent(tenantId, studentId, user, query);
  }

  @Get('student/:studentId/date/:date')
  @Roles(
    'admin',
    'coordinator',
    'secretary',
    'teacher',
    'guardian',
    'guardian_primary',
    'guardian_secondary',
  )
  async findByStudentAndDate(
    @CurrentTenant() tenantId: string,
    @Param('studentId') studentId: string,
    @Param('date') date: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.diaryService.findByStudentAndDate(tenantId, studentId, date, user);
  }

  @Get('student/:studentId/today')
  @Roles(
    'admin',
    'coordinator',
    'secretary',
    'teacher',
    'guardian',
    'guardian_primary',
    'guardian_secondary',
  )
  async findToday(
    @CurrentTenant() tenantId: string,
    @Param('studentId') studentId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const today = new Date().toISOString().slice(0, 10);
    return this.diaryService.findByStudentAndDate(tenantId, studentId, today, user);
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
    return this.diaryService.findById(tenantId, id);
  }

  @Post()
  @Roles('admin', 'coordinator', 'teacher')
  async create(
    @CurrentTenant() tenantId: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser() user: UserPayload,
    @Body() body: any,
  ) {
    return this.diaryService.create(tenantId, userId, user, body);
  }

  @Put(':id')
  @Roles('admin', 'coordinator', 'teacher')
  async update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
    @Body() body: any,
  ) {
    return this.diaryService.update(tenantId, id, user, body);
  }
}
