import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and, sql, isNull } from 'drizzle-orm';
import { DB, DrizzleDB, classes, students } from '@app/database';
import { v4 as uuidv4 } from 'uuid';

export interface ClassDto {
  id: string;
  tenantId: string;
  name: string;
  grade: string;
  year: number;
  shift: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClassDto {
  name: string;
  grade: string;
  year: number;
  shift: 'morning' | 'afternoon' | 'full';
}

export interface UpdateClassDto {
  name?: string;
  grade?: string;
  year?: number;
  shift?: string;
  status?: string;
}

@Injectable()
export class ClassesService {
  constructor(@Inject(DB) private readonly db: DrizzleDB) {}

  async findAll(tenantId: string, query?: any): Promise<ClassDto[]> {
    await this.setTenantContext(tenantId);
    
    const result = await this.db
      .select()
      .from(classes)
      .where(and(
        eq(classes.tenantId, tenantId),
        isNull(classes.deletedAt)
      ));

    return result as ClassDto[];
  }

  async findById(tenantId: string, id: string): Promise<ClassDto | null> {
    await this.setTenantContext(tenantId);
    
    const result = await this.db
      .select()
      .from(classes)
      .where(and(
        eq(classes.id, id),
        eq(classes.tenantId, tenantId),
        isNull(classes.deletedAt)
      ))
      .limit(1);

    return (result[0] as ClassDto) || null;
  }

  async getStudents(tenantId: string, classId: string) {
    await this.setTenantContext(tenantId);
    
    const result = await this.db
      .select()
      .from(students)
      .where(and(
        eq(students.tenantId, tenantId),
        eq(students.classId, classId),
        isNull(students.deletedAt)
      ));

    return result;
  }

  async create(tenantId: string, dto: CreateClassDto): Promise<ClassDto> {
    await this.setTenantContext(tenantId);
    
    const id = uuidv4();

    const [classItem] = await this.db
      .insert(classes)
      .values({
        id,
        tenantId,
        name: dto.name,
        grade: dto.grade,
        year: dto.year,
        shift: dto.shift,
        status: 'active',
      })
      .returning();

    return classItem as ClassDto;
  }

  async update(tenantId: string, id: string, dto: UpdateClassDto): Promise<ClassDto> {
    await this.setTenantContext(tenantId);
    
    const [classItem] = await this.db
      .update(classes)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(and(eq(classes.id, id), eq(classes.tenantId, tenantId)))
      .returning();

    if (!classItem) {
      throw new NotFoundException('Class not found');
    }

    return classItem as ClassDto;
  }

  async delete(tenantId: string, id: string): Promise<void> {
    await this.setTenantContext(tenantId);
    
    // Soft delete
    await this.db
      .update(classes)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(classes.id, id), eq(classes.tenantId, tenantId)));
  }

  private async setTenantContext(tenantId: string): Promise<void> {
    await this.db.execute(
      sql`SELECT set_config('app.tenant_id', ${tenantId}, false)`,
    );
  }
}
