import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { eq, and, sql, desc, isNull, isNotNull, inArray } from 'drizzle-orm';
import {
  DB,
  DrizzleDB,
  announcements,
  announcementReads,
  studentGuardians,
  students,
  classTeachers,
} from '@app/database';
import { v4 as uuidv4 } from 'uuid';
import { UserPayload } from '@app/common';

@Injectable()
export class AnnouncementsService {
  constructor(@Inject(DB) private readonly db: DrizzleDB) {}

  async findAll(tenantId: string, user: UserPayload, query?: any) {
    await this.setTenantContext(tenantId);

    const result = await this.db
      .select()
      .from(announcements)
      .where(
        and(
          eq(announcements.tenantId, tenantId),
          isNull(announcements.deletedAt),
          isNotNull(announcements.publishedAt),
        ),
      )
      .orderBy(desc(announcements.publishedAt))
      .limit(query?.limit || 50);

    return this.filterByAudience(result, tenantId, user);
  }

  async findById(tenantId: string, id: string, user: UserPayload) {
    await this.setTenantContext(tenantId);
    
    const result = await this.db
      .select()
      .from(announcements)
      .where(and(
        eq(announcements.id, id),
        eq(announcements.tenantId, tenantId),
        isNull(announcements.deletedAt)
      ))
      .limit(1);

    const found = result[0] || null;
    if (!found) return null;

    const allowed = await this.isAllowed(found, tenantId, user);
    if (!allowed) {
      throw new ForbiddenException('Not allowed to access announcement');
    }

    return found;
  }

  async create(tenantId: string, authorId: string, dto: any) {
    await this.setTenantContext(tenantId);
    
    const [announcement] = await this.db
      .insert(announcements)
      .values({
        tenantId,
        authorId,
        title: dto.title,
        content: dto.content,
        priority: dto.priority || 'normal',
        targetAudience: dto.targetAudience || 'all',
        targetClassIds: dto.targetClassIds || [],
        targetStudentIds: dto.targetStudentIds || [],
        publishedAt: dto.publish ? new Date() : null,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        sendPushNotification: dto.sendPushNotification ?? true,
      })
      .returning();

    return announcement;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.setTenantContext(tenantId);
    
    const [announcement] = await this.db
      .update(announcements)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(and(
        eq(announcements.id, id),
        eq(announcements.tenantId, tenantId)
      ))
      .returning();

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    return announcement;
  }

  async delete(tenantId: string, id: string) {
    await this.setTenantContext(tenantId);
    
    await this.db
      .update(announcements)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(
        eq(announcements.id, id),
        eq(announcements.tenantId, tenantId)
      ));

    return { deleted: true };
  }

  async markAsRead(tenantId: string, announcementId: string, userId: string) {
    await this.setTenantContext(tenantId);
    
    // Check if already read
    const existing = await this.db
      .select()
      .from(announcementReads)
      .where(and(
        eq(announcementReads.announcementId, announcementId),
        eq(announcementReads.userId, userId)
      ))
      .limit(1);

    if (existing[0]) {
      return existing[0];
    }

    const [read] = await this.db
      .insert(announcementReads)
      .values({
        tenantId,
        announcementId,
        userId,
      })
      .returning();

    return read;
  }

  private async setTenantContext(tenantId: string): Promise<void> {
    await this.db.execute(
      sql`SELECT set_config('app.tenant_id', ${tenantId}, false)`,
    );
  }

  private async isAllowed(
    ann: typeof announcements.$inferSelect,
    tenantId: string,
    user: UserPayload,
  ): Promise<boolean> {
    // Admin/coordinator can see all
    if (user.role === 'admin' || user.role === 'coordinator') return true;

    // Teachers: can see announcements targeting all or their classes
    if (user.role === 'teacher') {
      const classes = await this.getTeacherClassIds(tenantId, user.sub);
      if (ann.targetAudience === 'all') return true;
      if (classes.length > 0 && ann.targetClassIds?.some((c) => classes.includes(c))) {
        return true;
      }
      return false;
    }

    // Guardians: see announcements for all, their children's classes, or targeted students
    if (
      user.role === 'guardian' ||
      user.role === 'guardian_primary' ||
      user.role === 'guardian_secondary'
    ) {
      const { studentIds, classIds } = await this.getGuardianLinks(tenantId, user.sub);
      if (ann.targetAudience === 'all') return true;
      if (classIds.length > 0 && ann.targetClassIds?.some((c) => classIds.includes(c))) {
        return true;
      }
      if (studentIds.length > 0 && ann.targetStudentIds?.some((s) => studentIds.includes(s))) {
        return true;
      }
      return false;
    }

    return false;
  }

  private async filterByAudience(
    list: typeof announcements.$inferSelect[],
    tenantId: string,
    user: UserPayload,
  ) {
    const filtered: typeof announcements.$inferSelect[] = [];
    for (const ann of list) {
      const allowed = await this.isAllowed(ann, tenantId, user);
      if (allowed) filtered.push(ann);
    }
    return filtered;
  }

  private async getGuardianLinks(tenantId: string, guardianId: string) {
    const links = await this.db
      .select({
        studentId: studentGuardians.studentId,
      })
      .from(studentGuardians)
      .where(
        and(
          eq(studentGuardians.tenantId, tenantId),
          eq(studentGuardians.guardianId, guardianId),
        ),
      );

    const studentIds = links.map((l) => l.studentId);
    const classes =
      studentIds.length > 0
        ? await this.db
            .select({ classId: students.classId })
            .from(students)
            .where(and(eq(students.tenantId, tenantId), inArray(students.id, studentIds)))
        : [];

    const classIds = classes.map((c) => c.classId).filter(Boolean) as string[];

    return { studentIds, classIds };
  }

  private async getTeacherClassIds(tenantId: string, teacherId: string): Promise<string[]> {
    const rows = await this.db
      .select({ classId: classTeachers.classId })
      .from(classTeachers)
      .where(and(eq(classTeachers.tenantId, tenantId), eq(classTeachers.teacherId, teacherId)));
    return rows.map((r) => r.classId);
  }
}
