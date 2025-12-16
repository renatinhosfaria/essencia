import { UserPayload } from '@app/common';
import {
  DB,
  DrizzleDB,
  classTeachers,
  conversations,
  messages,
  studentGuardians,
} from '@app/database';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, desc, eq, inArray, isNull, ne, or, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MessagesService {
  constructor(@Inject(DB) private readonly db: DrizzleDB) {}

  async getConversationById(tenantId: string, conversationId: string) {
    await this.setTenantContext(tenantId);

    const [conversation] = await this.db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.tenantId, tenantId),
          eq(conversations.id, conversationId),
        ),
      )
      .limit(1);

    return conversation || null;
  }

  async getConversations(tenantId: string, userId: string) {
    await this.setTenantContext(tenantId);

    const result = await this.db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.tenantId, tenantId),
          or(
            eq(conversations.participant1Id, userId),
            eq(conversations.participant2Id, userId),
          ),
        ),
      )
      .orderBy(desc(conversations.lastMessageAt));

    return result;
  }

  async getMessages(tenantId: string, conversationId: string, query?: any) {
    await this.setTenantContext(tenantId);

    const result = await this.db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.tenantId, tenantId),
          eq(messages.conversationId, conversationId),
        ),
      )
      .orderBy(desc(messages.createdAt))
      .limit(query?.limit || 50);

    return result;
  }

  async createConversation(
    tenantId: string,
    participant1Id: string,
    participant2Id: string,
    studentId?: string,
    initiator?: UserPayload,
  ) {
    await this.setTenantContext(tenantId);

    if (studentId && initiator) {
      await this.assertParticipantAccess(tenantId, studentId, initiator);
    }

    // Check if conversation already exists
    const existing = await this.db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.tenantId, tenantId),
          or(
            and(
              eq(conversations.participant1Id, participant1Id),
              eq(conversations.participant2Id, participant2Id),
            ),
            and(
              eq(conversations.participant1Id, participant2Id),
              eq(conversations.participant2Id, participant1Id),
            ),
          ),
        ),
      )
      .limit(1);

    if (existing[0]) {
      return existing[0];
    }

    const id = uuidv4();

    const [conversation] = await this.db
      .insert(conversations)
      .values({
        id,
        tenantId,
        participant1Id,
        participant2Id,
        studentId: studentId || null,
      })
      .returning();

    return conversation;
  }

  async sendMessage(
    tenantId: string,
    conversationId: string,
    senderId: string,
    content: string,
  ) {
    await this.setTenantContext(tenantId);

    const id = uuidv4();
    const now = new Date();

    // Ensure participant can send in this conversation
    await this.ensureConversationParticipant(
      tenantId,
      conversationId,
      senderId,
    );

    const [message] = await this.db
      .insert(messages)
      .values({
        id,
        tenantId,
        conversationId,
        senderId,
        content,
        status: 'sent',
      })
      .returning();

    // Update conversation's lastMessageAt
    await this.db
      .update(conversations)
      .set({
        lastMessageAt: now,
        updatedAt: now,
      })
      .where(eq(conversations.id, conversationId));

    return message;
  }

  async markAsRead(tenantId: string, messageId: string) {
    await this.setTenantContext(tenantId);

    const [message] = await this.db
      .update(messages)
      .set({
        status: 'read',
        readAt: new Date(),
      })
      .where(and(eq(messages.id, messageId), eq(messages.tenantId, tenantId)))
      .returning();

    return message;
  }

  async markMessagesAsRead(
    tenantId: string,
    conversationId: string,
    messageIds: string[],
    readerId: string,
  ) {
    await this.setTenantContext(tenantId);

    if (!messageIds?.length) {
      return [];
    }

    const now = new Date();

    const updated = await this.db
      .update(messages)
      .set({
        status: 'read',
        readAt: now,
      })
      .where(
        and(
          eq(messages.tenantId, tenantId),
          eq(messages.conversationId, conversationId),
          inArray(messages.id, messageIds),
          ne(messages.senderId, readerId),
          isNull(messages.readAt),
        ),
      )
      .returning();

    return updated;
  }

  async getUnreadCount(tenantId: string, userId: string): Promise<number> {
    await this.setTenantContext(tenantId);

    const result = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(
        and(
          eq(messages.tenantId, tenantId),
          ne(messages.senderId, userId),
          isNull(messages.readAt),
        ),
      );

    return result[0]?.count || 0;
  }

  async markConversationAsRead(
    tenantId: string,
    conversationId: string,
    userId: string,
  ) {
    await this.setTenantContext(tenantId);

    const [conversation] = await this.db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.id, conversationId),
          eq(conversations.tenantId, tenantId),
        ),
      )
      .limit(1);

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (
      conversation.participant1Id !== userId &&
      conversation.participant2Id !== userId
    ) {
      throw new NotFoundException('Conversation not found');
    }

    const updated = await this.db
      .update(messages)
      .set({
        status: 'read',
        readAt: new Date(),
      })
      .where(
        and(
          eq(messages.tenantId, tenantId),
          eq(messages.conversationId, conversationId),
          ne(messages.senderId, userId),
          isNull(messages.readAt),
        ),
      )
      .returning();

    return { updatedCount: updated.length };
  }

  private async ensureConversationParticipant(
    tenantId: string,
    conversationId: string,
    userId: string,
  ) {
    const [conversation] = await this.db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.id, conversationId),
          eq(conversations.tenantId, tenantId),
        ),
      )
      .limit(1);

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (
      conversation.participant1Id !== userId &&
      conversation.participant2Id !== userId
    ) {
      throw new ForbiddenException('Not a participant of this conversation');
    }
  }

  private async assertParticipantAccess(
    tenantId: string,
    studentId: string,
    user: UserPayload,
  ) {
    await this.setTenantContext(tenantId);

    if (
      user.role === 'guardian' ||
      user.role === 'guardian_primary' ||
      user.role === 'guardian_secondary'
    ) {
      const link = await this.db
        .select()
        .from(studentGuardians)
        .where(
          and(
            eq(studentGuardians.tenantId, tenantId),
            eq(studentGuardians.studentId, studentId),
            eq(studentGuardians.guardianId, user.sub),
          ),
        )
        .limit(1);

      if (!link[0]) {
        throw new ForbiddenException('Access denied to student conversation');
      }
    }

    if (user.role === 'teacher') {
      const link = await this.db
        .select()
        .from(classTeachers)
        .where(
          and(
            eq(classTeachers.tenantId, tenantId),
            eq(classTeachers.teacherId, user.sub),
          ),
        )
        .limit(1);

      if (!link[0]) {
        throw new ForbiddenException(
          'Teacher not linked to any class for this student',
        );
      }
    }
  }

  private async setTenantContext(tenantId: string): Promise<void> {
    await this.db.execute(
      sql`SELECT set_config('app.tenant_id', ${tenantId}, false)`,
    );
  }
}
