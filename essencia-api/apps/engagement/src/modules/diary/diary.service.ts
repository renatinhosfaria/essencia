import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import {
  DB,
  DrizzleDB,
  classTeachers,
  diaryEntries,
  studentGuardians,
  students,
} from '@app/database';
import { v4 as uuidv4 } from 'uuid';
import { UserPayload } from '@app/common';

export interface DiaryEntryDto {
  id: string;
  tenantId: string;
  studentId: string;
  classId: string;
  date: string;
  mood: string | null;
  meals:
    | {
        breakfast?: 'full' | 'partial' | 'refused' | 'na';
        lunch?: 'full' | 'partial' | 'refused' | 'na';
        snack?: 'full' | 'partial' | 'refused' | 'na';
      }
    | null;
  napMinutes: number | null;
  activities: string[] | null;
  observations: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDiaryEntryDto {
  studentId: string;
  classId: string;
  date: string;
  mood?: string;
  meals?: {
    breakfast?: 'full' | 'partial' | 'refused' | 'na';
    lunch?: 'full' | 'partial' | 'refused' | 'na';
    snack?: 'full' | 'partial' | 'refused' | 'na';
  };
  napMinutes?: number;
  activities?: string[];
  observations?: string;
}

@Injectable()
export class DiaryService {
  constructor(@Inject(DB) private readonly db: DrizzleDB) {}

  async findAll(tenantId: string, user: UserPayload, query?: any): Promise<DiaryEntryDto[]> {
    await this.setTenantContext(tenantId);
    const limit = query?.limit || 50;

    let whereClause = eq(diaryEntries.tenantId, tenantId);

    if (user.role === 'teacher') {
      const classIds = await this.getTeacherClassIds(tenantId, user.sub);
      if (classIds.length === 0) return [];
      whereClause = and(whereClause, inArray(diaryEntries.classId, classIds))!;
    }

    const result = await this.db
      .select()
      .from(diaryEntries)
      .where(whereClause)
      .orderBy(desc(diaryEntries.date))
      .limit(limit);

    return result as DiaryEntryDto[];
  }

  async findById(tenantId: string, id: string): Promise<DiaryEntryDto | null> {
    await this.setTenantContext(tenantId);

    const result = await this.db
      .select()
      .from(diaryEntries)
      .where(and(eq(diaryEntries.id, id), eq(diaryEntries.tenantId, tenantId)))
      .limit(1);

    return (result[0] as DiaryEntryDto) || null;
  }

  async findByStudent(
    tenantId: string,
    studentId: string,
    user: UserPayload,
    query?: any,
  ): Promise<DiaryEntryDto[]> {
    await this.setTenantContext(tenantId);
    await this.assertAccessForStudent(tenantId, studentId, user);

    const result = await this.db
      .select()
      .from(diaryEntries)
      .where(and(eq(diaryEntries.tenantId, tenantId), eq(diaryEntries.studentId, studentId)))
      .orderBy(desc(diaryEntries.date))
      .limit(query?.limit || 30);

    return result as DiaryEntryDto[];
  }

  async findByStudentAndDate(
    tenantId: string,
    studentId: string,
    date: string,
    user: UserPayload,
  ): Promise<DiaryEntryDto | null> {
    await this.setTenantContext(tenantId);
    await this.assertAccessForStudent(tenantId, studentId, user);

    const result = await this.db
      .select()
      .from(diaryEntries)
      .where(
        and(
          eq(diaryEntries.tenantId, tenantId),
          eq(diaryEntries.studentId, studentId),
          eq(diaryEntries.date, date),
        ),
      )
      .limit(1);

    return (result[0] as DiaryEntryDto) || null;
  }

  async assertGuardianAccess(tenantId: string, studentId: string, guardianId: string) {
    await this.setTenantContext(tenantId);

    const link = await this.db
      .select()
      .from(studentGuardians)
      .where(
        and(
          eq(studentGuardians.tenantId, tenantId),
          eq(studentGuardians.studentId, studentId),
          eq(studentGuardians.guardianId, guardianId),
        ),
      )
      .limit(1);

    if (!link[0]) {
      throw new ForbiddenException('Access denied to student diary');
    }
  }

  async create(
    tenantId: string,
    userId: string,
    user: UserPayload,
    dto: CreateDiaryEntryDto,
  ): Promise<DiaryEntryDto> {
    await this.setTenantContext(tenantId);
    await this.assertTeacherAccess(tenantId, dto.classId, user);

    const id = uuidv4();

    const [entry] = await this.db
      .insert(diaryEntries)
      .values({
        id,
        tenantId,
        studentId: dto.studentId,
        classId: dto.classId,
        date: dto.date,
        mood: dto.mood || null,
        meals: dto.meals || null,
        napMinutes: dto.napMinutes || null,
        activities: dto.activities || null,
        observations: dto.observations || null,
        createdBy: userId,
      })
      .returning();

    return entry as DiaryEntryDto;
  }

  async update(
    tenantId: string,
    id: string,
    user: UserPayload,
    dto: Partial<CreateDiaryEntryDto>,
  ): Promise<DiaryEntryDto> {
    await this.setTenantContext(tenantId);

    if (user.role === 'teacher') {
      const classId = dto.classId || (await this.findEntryClassId(tenantId, id));
      if (classId) {
        await this.assertTeacherAccess(tenantId, classId, user);
      }
    }

    const [entry] = await this.db
      .update(diaryEntries)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(and(eq(diaryEntries.id, id), eq(diaryEntries.tenantId, tenantId)))
      .returning();

    if (!entry) {
      throw new NotFoundException('Diary entry not found');
    }

    return entry as DiaryEntryDto;
  }

  private async setTenantContext(tenantId: string): Promise<void> {
    await this.db.execute(sql`SELECT set_config('app.tenant_id', ${tenantId}, false)`);
  }

  private async assertTeacherAccess(tenantId: string, classId: string, user: UserPayload) {
    if (user.role !== 'teacher') return;
    const classIds = await this.getTeacherClassIds(tenantId, user.sub);
    if (!classIds.includes(classId)) {
      throw new ForbiddenException('Teacher not linked to this class');
    }
  }

  private async assertAccessForStudent(tenantId: string, studentId: string, user: UserPayload) {
    if (user.role === 'guardian' || user.role === 'guardian_primary' || user.role === 'guardian_secondary') {
      await this.assertGuardianAccess(tenantId, studentId, user.sub);
      return;
    }
    if (user.role === 'teacher') {
      const student = await this.db
        .select({ classId: students.classId })
        .from(students)
        .where(and(eq(students.id, studentId), eq(students.tenantId, tenantId)))
        .limit(1);
      const classId = student[0]?.classId;
      if (!classId) {
        throw new ForbiddenException('Student without class assignment');
      }
      await this.assertTeacherAccess(tenantId, classId, user);
    }
  }

  private async getTeacherClassIds(tenantId: string, teacherId: string): Promise<string[]> {
    const rows = await this.db
      .select({ classId: classTeachers.classId })
      .from(classTeachers)
      .where(and(eq(classTeachers.tenantId, tenantId), eq(classTeachers.teacherId, teacherId)));
    return rows.map((r) => r.classId);
  }

  private async findEntryClassId(tenantId: string, entryId: string): Promise<string | null> {
    const row = await this.db
      .select({ classId: diaryEntries.classId })
      .from(diaryEntries)
      .where(and(eq(diaryEntries.id, entryId), eq(diaryEntries.tenantId, tenantId)))
      .limit(1);
    return row[0]?.classId || null;
  }
}
