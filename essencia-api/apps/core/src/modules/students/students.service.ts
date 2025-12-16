import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and, sql, isNull, inArray } from 'drizzle-orm';
import { DB, DrizzleDB, students, studentGuardians } from '@app/database';
import { v4 as uuidv4 } from 'uuid';

export interface StudentDto {
  id: string;
  tenantId: string;
  classId: string | null;
  name: string;
  birthDate: string | null;
  avatarUrl: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStudentDto {
  name: string;
  classId?: string;
  birthDate?: string;
  avatarUrl?: string;
}

export interface UpdateStudentDto {
  name?: string;
  classId?: string;
  birthDate?: string;
  avatarUrl?: string;
  status?: string;
}

@Injectable()
export class StudentsService {
  constructor(@Inject(DB) private readonly db: DrizzleDB) {}

  async findAll(tenantId: string, query?: any): Promise<StudentDto[]> {
    await this.setTenantContext(tenantId);
    
    const result = await this.db
      .select()
      .from(students)
      .where(and(
        eq(students.tenantId, tenantId),
        isNull(students.deletedAt)
      ));

    return result as StudentDto[];
  }

  async findById(tenantId: string, id: string): Promise<StudentDto | null> {
    await this.setTenantContext(tenantId);
    
    const result = await this.db
      .select()
      .from(students)
      .where(and(
        eq(students.id, id),
        eq(students.tenantId, tenantId),
        isNull(students.deletedAt)
      ))
      .limit(1);

    return (result[0] as StudentDto) || null;
  }

  async findByGuardian(tenantId: string, guardianId: string): Promise<StudentDto[]> {
    await this.setTenantContext(tenantId);

    const links = await this.db
      .select({ studentId: studentGuardians.studentId })
      .from(studentGuardians)
      .where(and(eq(studentGuardians.tenantId, tenantId), eq(studentGuardians.guardianId, guardianId)));

    if (links.length === 0) return [];

    const studentIds = links.map((l) => l.studentId);

    const result = await this.db
      .select()
      .from(students)
      .where(and(eq(students.tenantId, tenantId), inArray(students.id, studentIds), isNull(students.deletedAt)));

    return result as StudentDto[];
  }

  async findByClassId(tenantId: string, classId: string): Promise<StudentDto[]> {
    await this.setTenantContext(tenantId);
    
    const result = await this.db
      .select()
      .from(students)
      .where(and(
        eq(students.tenantId, tenantId),
        eq(students.classId, classId),
        isNull(students.deletedAt)
      ));

    return result as StudentDto[];
  }

  async create(tenantId: string, dto: CreateStudentDto): Promise<StudentDto> {
    await this.setTenantContext(tenantId);
    
    const id = uuidv4();

    const [student] = await this.db
      .insert(students)
      .values({
        id,
        tenantId,
        classId: dto.classId || null,
        name: dto.name,
        birthDate: dto.birthDate || null,
        avatarUrl: dto.avatarUrl || null,
        status: 'active',
      })
      .returning();

    return student as StudentDto;
  }

  async update(tenantId: string, id: string, dto: UpdateStudentDto): Promise<StudentDto> {
    await this.setTenantContext(tenantId);
    
    const [student] = await this.db
      .update(students)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(and(eq(students.id, id), eq(students.tenantId, tenantId)))
      .returning();

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student as StudentDto;
  }

  async delete(tenantId: string, id: string): Promise<void> {
    await this.setTenantContext(tenantId);
    
    // Soft delete (LGPD compliance)
    await this.db
      .update(students)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(students.id, id), eq(students.tenantId, tenantId)));
  }

  private async setTenantContext(tenantId: string): Promise<void> {
    await this.db.execute(
      sql`SELECT set_config('app.tenant_id', ${tenantId}, false)`,
    );
  }
}
