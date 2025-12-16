// Schema exports - consolidated from all schema files
import {
  date,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  boolean,
  varchar,
} from 'drizzle-orm/pg-core';

// ============================================
// TENANTS
// ============================================
export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  settings: jsonb('settings').notNull().default({}),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ============================================
// USERS
// ============================================
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey(),
    tenantId: uuid('tenant_id').notNull(),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    name: text('name').notNull(),
    phone: text('phone'),
    avatarUrl: text('avatar_url'),
    role: text('role').notNull(),
    status: text('status').notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    tenantEmailUnique: uniqueIndex('users_tenant_email_unique').on(
      table.tenantId,
      table.email,
    ),
  }),
);

// ============================================
// CLASSES (Turmas)
// ============================================
export const classes = pgTable(
  'classes',
  {
    id: uuid('id').primaryKey(),
    tenantId: uuid('tenant_id').notNull(),
    name: text('name').notNull(),
    grade: text('grade').notNull(),
    year: integer('year').notNull(),
    shift: text('shift').notNull(),
    status: text('status').notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => ({
    tenantIdx: index('idx_classes_tenant_id').on(table.tenantId),
  }),
);

// ============================================
// STUDENTS (Alunos)
// ============================================
export const students = pgTable(
  'students',
  {
    id: uuid('id').primaryKey(),
    tenantId: uuid('tenant_id').notNull(),
    classId: uuid('class_id'),
    name: text('name').notNull(),
    birthDate: date('birth_date'),
    avatarUrl: text('avatar_url'),
    status: text('status').notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => ({
    tenantIdx: index('idx_students_tenant_id').on(table.tenantId),
    classIdx: index('idx_students_class_id').on(table.classId),
  }),
);

// ============================================
// STUDENT GUARDIANS
// ============================================
export const studentGuardians = pgTable(
  'student_guardians',
  {
    id: uuid('id').primaryKey(),
    tenantId: uuid('tenant_id').notNull(),
    studentId: uuid('student_id').notNull(),
    guardianId: uuid('guardian_id').notNull(),
    relationship: text('relationship').notNull(),
    isPrimary: text('is_primary').notNull().default('false'),
    canPickup: text('can_pickup').notNull().default('true'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    studentGuardianUnique: uniqueIndex('student_guardian_unique').on(
      table.studentId,
      table.guardianId,
    ),
    studentIdx: index('idx_student_guardians_student_id').on(table.studentId),
    guardianIdx: index('idx_student_guardians_guardian_id').on(table.guardianId),
  }),
);

// ============================================
// CLASS TEACHERS
// ============================================
export const classTeachers = pgTable(
  'class_teachers',
  {
    id: uuid('id').primaryKey(),
    tenantId: uuid('tenant_id').notNull(),
    classId: uuid('class_id').notNull(),
    teacherId: uuid('teacher_id').notNull(),
    isPrimary: text('is_primary').notNull().default('false'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    classTeacherUnique: uniqueIndex('class_teacher_unique').on(
      table.classId,
      table.teacherId,
    ),
    classIdx: index('idx_class_teachers_class_id').on(table.classId),
    teacherIdx: index('idx_class_teachers_teacher_id').on(table.teacherId),
  }),
);

// ============================================
// DIARY ENTRIES
// ============================================
export const diaryEntries = pgTable(
  'diary_entries',
  {
    id: uuid('id').primaryKey(),
    tenantId: uuid('tenant_id').notNull(),
    studentId: uuid('student_id').notNull(),
    classId: uuid('class_id').notNull(),
    date: date('date').notNull(),
    mood: text('mood'),
    meals: jsonb('meals').$type<{
      breakfast?: 'full' | 'partial' | 'refused' | 'na';
      lunch?: 'full' | 'partial' | 'refused' | 'na';
      snack?: 'full' | 'partial' | 'refused' | 'na';
    }>(),
    napMinutes: integer('nap_minutes'),
    activities: jsonb('activities').$type<string[]>(),
    observations: text('observations'),
    createdBy: uuid('created_by').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    studentDateUnique: uniqueIndex('diary_student_date_unique').on(
      table.studentId,
      table.date,
    ),
    tenantIdx: index('idx_diary_entries_tenant_id').on(table.tenantId),
    studentIdx: index('idx_diary_entries_student_id').on(table.studentId),
    classIdx: index('idx_diary_entries_class_id').on(table.classId),
    dateIdx: index('idx_diary_entries_date').on(table.date),
  }),
);

// ============================================
// CONVERSATIONS & MESSAGES
// ============================================
export const conversations = pgTable(
  'conversations',
  {
    id: uuid('id').primaryKey(),
    tenantId: uuid('tenant_id').notNull(),
    participant1Id: uuid('participant1_id').notNull(),
    participant2Id: uuid('participant2_id').notNull(),
    studentId: uuid('student_id'),
    lastMessageAt: timestamp('last_message_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    tenantIdx: index('idx_conversations_tenant_id').on(table.tenantId),
    participant1Idx: index('idx_conversations_participant1_id').on(table.participant1Id),
    participant2Idx: index('idx_conversations_participant2_id').on(table.participant2Id),
    studentIdx: index('idx_conversations_student_id').on(table.studentId),
    participantsUnique: uniqueIndex('conversations_participants_unique').on(
      table.participant1Id,
      table.participant2Id,
    ),
  }),
);

export const messages = pgTable(
  'messages',
  {
    id: uuid('id').primaryKey(),
    tenantId: uuid('tenant_id').notNull(),
    conversationId: uuid('conversation_id').notNull(),
    senderId: uuid('sender_id').notNull(),
    content: text('content').notNull(),
    status: text('status').notNull().default('sent'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    deliveredAt: timestamp('delivered_at', { withTimezone: true }),
    readAt: timestamp('read_at', { withTimezone: true }),
  },
  (table) => ({
    tenantIdx: index('idx_messages_tenant_id').on(table.tenantId),
    conversationIdx: index('idx_messages_conversation_id').on(table.conversationId),
    senderIdx: index('idx_messages_sender_id').on(table.senderId),
    createdAtIdx: index('idx_messages_created_at').on(table.createdAt),
  }),
);

// ============================================
// ANNOUNCEMENTS
// ============================================
export const announcements = pgTable(
  'announcements',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id').notNull(),
    authorId: uuid('author_id').notNull(),
    title: varchar('title', { length: 200 }).notNull(),
    content: text('content').notNull(),
    priority: varchar('priority', { length: 20 }).notNull().default('normal'),
    targetAudience: varchar('target_audience', { length: 50 }).notNull(),
    targetClassIds: jsonb('target_class_ids').$type<string[]>().default([]),
    targetStudentIds: jsonb('target_student_ids').$type<string[]>().default([]),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    sendPushNotification: boolean('send_push_notification').notNull().default(true),
    pushNotificationSentAt: timestamp('push_notification_sent_at', { withTimezone: true }),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('announcements_tenant_idx').on(table.tenantId),
    authorIdx: index('announcements_author_idx').on(table.authorId),
    publishedAtIdx: index('announcements_published_at_idx').on(table.publishedAt),
    priorityIdx: index('announcements_priority_idx').on(table.priority),
  }),
);

export const announcementReads = pgTable(
  'announcement_reads',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id').notNull(),
    announcementId: uuid('announcement_id').notNull(),
    userId: uuid('user_id').notNull(),
    readAt: timestamp('read_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('announcement_reads_tenant_idx').on(table.tenantId),
    announcementIdx: index('announcement_reads_announcement_idx').on(table.announcementId),
    userIdx: index('announcement_reads_user_idx').on(table.userId),
    announcementUserUnique: uniqueIndex('announcement_reads_unique').on(
      table.announcementId,
      table.userId,
    ),
  }),
);

// ============================================
// GALLERY
// ============================================
export type MediaItem = {
  url: string;
  type: 'photo' | 'video';
  thumbnailUrl?: string;
  key: string;
};

export const galleryPosts = pgTable(
  'gallery_posts',
  {
    id: uuid('id').primaryKey(),
    tenantId: uuid('tenant_id').notNull(),
    classId: uuid('class_id').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    mediaItems: jsonb('media_items').$type<MediaItem[]>().notNull(),
    createdBy: uuid('created_by').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => ({
    tenantIdx: index('idx_gallery_posts_tenant_id').on(table.tenantId),
    classIdx: index('idx_gallery_posts_class_id').on(table.classId),
    createdAtIdx: index('idx_gallery_posts_created_at').on(table.createdAt),
  }),
);

export const galleryPostStudents = pgTable(
  'gallery_post_students',
  {
    id: uuid('id').primaryKey(),
    tenantId: uuid('tenant_id').notNull(),
    postId: uuid('post_id').notNull(),
    studentId: uuid('student_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    postStudentUnique: uniqueIndex('gallery_post_student_unique').on(table.postId, table.studentId),
    postIdx: index('idx_gallery_post_students_post_id').on(table.postId),
    studentIdx: index('idx_gallery_post_students_student_id').on(table.studentId),
  }),
);

// ============================================
// NOTIFICATIONS
// ============================================
export const deviceTokens = pgTable(
  'device_tokens',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id').notNull(),
    userId: uuid('user_id').notNull(),
    token: text('token').notNull(),
    platform: varchar('platform', { length: 20 }).notNull(),
    deviceId: varchar('device_id', { length: 255 }).notNull(),
    deviceName: varchar('device_name', { length: 255 }),
    isActive: boolean('is_active').notNull().default(true),
    lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('device_tokens_tenant_idx').on(table.tenantId),
    userIdx: index('device_tokens_user_idx').on(table.userId),
    tokenIdx: index('device_tokens_token_idx').on(table.token),
  }),
);

export const notificationQueue = pgTable(
  'notification_queue',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id').notNull(),
    userId: uuid('user_id').notNull(),
    deviceTokenId: uuid('device_token_id'),
    title: varchar('title', { length: 200 }).notNull(),
    body: text('body').notNull(),
    data: jsonb('data').$type<Record<string, unknown>>().default({}),
    imageUrl: text('image_url'),
    priority: varchar('priority', { length: 20 }).notNull().default('normal'),
    status: varchar('status', { length: 20 }).notNull().default('pending'),
    attempts: integer('attempts').notNull().default(0),
    maxAttempts: integer('max_attempts').notNull().default(3),
    scheduledFor: timestamp('scheduled_for', { withTimezone: true }),
    sentAt: timestamp('sent_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('notification_queue_tenant_idx').on(table.tenantId),
    userIdx: index('notification_queue_user_idx').on(table.userId),
    statusIdx: index('notification_queue_status_idx').on(table.status),
  }),
);

// ============================================
// AUTH SUPPORT TABLES
// ============================================
export const invitations = pgTable(
  'invitations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    email: text('email').notNull(),
    role: text('role').notNull(),
    token: text('token').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    usedAt: timestamp('used_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('idx_invitations_tenant_id').on(table.tenantId),
    tokenIdx: uniqueIndex('invitations_token_unique').on(table.token),
  }),
);

export const refreshTokens = pgTable(
  'refresh_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    userId: uuid('user_id').notNull(),
    token: text('token').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
  },
  (table) => ({
    tenantIdx: index('idx_refresh_tokens_tenant_id').on(table.tenantId),
    userIdx: index('idx_refresh_tokens_user_id').on(table.userId),
    tokenIdx: uniqueIndex('refresh_tokens_token_unique').on(table.token),
  }),
);

export const passwordResetTokens = pgTable(
  'password_reset_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    userId: uuid('user_id').notNull(),
    token: text('token').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    usedAt: timestamp('used_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('idx_prt_tenant_id').on(table.tenantId),
    userIdx: index('idx_prt_user_id').on(table.userId),
    tokenIdx: uniqueIndex('password_reset_token_unique').on(table.token),
  }),
);

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id'),
    userId: uuid('user_id'),
    event: text('event').notNull(),
    ip: text('ip'),
    userAgent: text('user_agent'),
    metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('idx_audit_logs_tenant_id').on(table.tenantId),
    userIdx: index('idx_audit_logs_user_id').on(table.userId),
    eventIdx: index('idx_audit_logs_event').on(table.event),
  }),
);

// ============================================
// SCHEMA EXPORT
// ============================================
export const schema = {
  tenants,
  users,
  classes,
  students,
  studentGuardians,
  classTeachers,
  diaryEntries,
  conversations,
  messages,
  announcements,
  announcementReads,
  galleryPosts,
  galleryPostStudents,
  deviceTokens,
  notificationQueue,
  invitations,
  refreshTokens,
  passwordResetTokens,
  auditLogs,
};
