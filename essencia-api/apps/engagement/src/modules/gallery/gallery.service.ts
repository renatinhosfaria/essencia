import { PaginatedResponseDto } from '@app/common';
import {
  DB,
  DrizzleDB,
  galleryPosts,
  galleryPostStudents,
  MediaItem,
  studentGuardians,
} from '@app/database';
import { StorageService } from '@app/storage';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq, inArray, isNull, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

function parsePositiveInt(value: unknown, fallback: number): number {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

@Injectable()
export class GalleryService {
  constructor(
    @Inject(DB) private readonly db: DrizzleDB,
    private readonly storageService: StorageService,
  ) {}

  async findAll(tenantId: string, query?: any) {
    await this.setTenantContext(tenantId);

    const page = parsePositiveInt(query?.page, 1);
    const limit = Math.min(parsePositiveInt(query?.limit, 20), 50);
    const offset = (page - 1) * limit;

    const where = and(
      eq(galleryPosts.tenantId, tenantId),
      isNull(galleryPosts.deletedAt),
    );

    const countRows = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(galleryPosts)
      .where(where);

    const total = Number(countRows[0]?.count ?? 0) || 0;

    const result = await this.db
      .select()
      .from(galleryPosts)
      .where(where)
      .orderBy(desc(galleryPosts.createdAt))
      .limit(limit)
      .offset(offset);

    return new PaginatedResponseDto(result, total, page, limit);
  }

  async findByClass(tenantId: string, classId: string, query?: any) {
    await this.setTenantContext(tenantId);

    const page = parsePositiveInt(query?.page, 1);
    const limit = Math.min(parsePositiveInt(query?.limit, 20), 50);
    const offset = (page - 1) * limit;

    const where = and(
      eq(galleryPosts.tenantId, tenantId),
      eq(galleryPosts.classId, classId),
      isNull(galleryPosts.deletedAt),
    );

    const countRows = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(galleryPosts)
      .where(where);

    const total = Number(countRows[0]?.count ?? 0) || 0;

    const result = await this.db
      .select()
      .from(galleryPosts)
      .where(where)
      .orderBy(desc(galleryPosts.createdAt))
      .limit(limit)
      .offset(offset);

    return new PaginatedResponseDto(result, total, page, limit);
  }

  async findByStudent(tenantId: string, studentId: string, query?: any) {
    await this.setTenantContext(tenantId);

    const page = parsePositiveInt(query?.page, 1);
    const limit = Math.min(parsePositiveInt(query?.limit, 20), 50);
    const offset = (page - 1) * limit;

    const postIdsRows = await this.db
      .select({ postId: galleryPostStudents.postId })
      .from(galleryPostStudents)
      .where(
        and(
          eq(galleryPostStudents.tenantId, tenantId),
          eq(galleryPostStudents.studentId, studentId),
        ),
      );

    const postIds = postIdsRows.map((row) => row.postId);
    if (postIds.length === 0) {
      return new PaginatedResponseDto([], 0, page, limit);
    }

    const where = and(
      eq(galleryPosts.tenantId, tenantId),
      inArray(galleryPosts.id, postIds),
      isNull(galleryPosts.deletedAt),
    );

    const countRows = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(galleryPosts)
      .where(where);

    const total = Number(countRows[0]?.count ?? 0) || 0;

    const result = await this.db
      .select()
      .from(galleryPosts)
      .where(where)
      .orderBy(desc(galleryPosts.createdAt))
      .limit(limit)
      .offset(offset);

    return new PaginatedResponseDto(result, total, page, limit);
  }

  async findById(tenantId: string, id: string) {
    await this.setTenantContext(tenantId);

    const result = await this.db
      .select()
      .from(galleryPosts)
      .where(
        and(
          eq(galleryPosts.id, id),
          eq(galleryPosts.tenantId, tenantId),
          isNull(galleryPosts.deletedAt),
        ),
      )
      .limit(1);

    if (!result[0]) {
      return null;
    }

    // Get tagged students
    const taggedStudents = await this.db
      .select()
      .from(galleryPostStudents)
      .where(eq(galleryPostStudents.postId, id));

    return {
      ...result[0],
      taggedStudentIds: taggedStudents.map((t) => t.studentId),
    };
  }

  async create(
    tenantId: string,
    userId: string,
    dto: any,
    files?: Express.Multer.File[],
  ) {
    await this.setTenantContext(tenantId);

    const mediaItems: MediaItem[] = [];

    // Upload files if provided
    if (files && files.length > 0) {
      for (const file of files) {
        const result = await this.storageService.uploadForTenant(
          tenantId,
          file.buffer,
          file.originalname,
          {
            folder: 'gallery',
            contentType: file.mimetype,
          },
        );

        mediaItems.push({
          url: result.url,
          type: file.mimetype.startsWith('video/') ? 'video' : 'photo',
          key: result.key,
        });
      }
    } else if (dto.mediaItems) {
      // Use provided media items
      mediaItems.push(...dto.mediaItems);
    }

    const id = uuidv4();

    const [post] = await this.db
      .insert(galleryPosts)
      .values({
        id,
        tenantId,
        classId: dto.classId,
        title: dto.title,
        description: dto.description || null,
        mediaItems,
        createdBy: userId,
      })
      .returning();

    // Tag students if provided
    if (dto.studentIds && dto.studentIds.length > 0) {
      await this.tagStudents(tenantId, id, dto.studentIds);
    }

    return post;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.setTenantContext(tenantId);

    const [post] = await this.db
      .update(galleryPosts)
      .set({
        title: dto.title,
        description: dto.description,
        updatedAt: new Date(),
      })
      .where(and(eq(galleryPosts.id, id), eq(galleryPosts.tenantId, tenantId)))
      .returning();

    if (!post) {
      throw new NotFoundException('Gallery post not found');
    }

    return post;
  }

  async delete(tenantId: string, id: string) {
    await this.setTenantContext(tenantId);

    // Get post to delete media files
    const post = await this.findById(tenantId, id);
    if (post && post.mediaItems) {
      const keys = post.mediaItems.map((m: MediaItem) => m.key);
      await this.storageService.deleteMany(keys);
    }

    // Soft delete
    await this.db
      .update(galleryPosts)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(galleryPosts.id, id), eq(galleryPosts.tenantId, tenantId)));

    return { deleted: true };
  }

  async tagStudents(tenantId: string, postId: string, studentIds: string[]) {
    await this.setTenantContext(tenantId);

    // Remove existing tags
    await this.db
      .delete(galleryPostStudents)
      .where(eq(galleryPostStudents.postId, postId));

    // Add new tags
    if (studentIds.length > 0) {
      await this.db.insert(galleryPostStudents).values(
        studentIds.map((studentId) => ({
          id: uuidv4(),
          tenantId,
          postId,
          studentId,
        })),
      );
    }

    return { taggedCount: studentIds.length };
  }

  async verifyGuardianAccess(
    tenantId: string,
    guardianId: string,
    studentId: string,
  ): Promise<boolean> {
    await this.setTenantContext(tenantId);

    const result = await this.db
      .select()
      .from(studentGuardians)
      .where(
        and(
          eq(studentGuardians.tenantId, tenantId),
          eq(studentGuardians.guardianId, guardianId),
          eq(studentGuardians.studentId, studentId),
        ),
      )
      .limit(1);

    return result.length > 0;
  }

  private async setTenantContext(tenantId: string): Promise<void> {
    await this.db.execute(
      sql`SELECT set_config('app.tenant_id', ${tenantId}, false)`,
    );
  }
}
