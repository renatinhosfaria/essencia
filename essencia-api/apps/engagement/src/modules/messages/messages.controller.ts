import {
  CurrentTenant,
  CurrentUser,
  JwtAuthGuard,
  Roles,
  RolesGuard,
  UserPayload,
} from '@app/common';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';

@Controller('messages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly messagesGateway: MessagesGateway,
  ) {}

  @Get('conversations')
  @Roles(
    'admin',
    'coordinator',
    'secretary',
    'teacher',
    'guardian',
    'guardian_primary',
    'guardian_secondary',
  )
  async getConversations(
    @CurrentTenant() tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.messagesService.getConversations(tenantId, userId);
  }

  @Get('conversations/:conversationId')
  @Roles(
    'admin',
    'coordinator',
    'secretary',
    'teacher',
    'guardian',
    'guardian_primary',
    'guardian_secondary',
  )
  async getMessages(
    @CurrentTenant() tenantId: string,
    @Param('conversationId') conversationId: string,
    @Query() query: any,
    @CurrentUser('sub') userId: string,
    @CurrentUser() user: UserPayload,
  ) {
    // FR17-18: Verify user has access to this conversation
    const conversation = await this.messagesService.getConversationById(
      tenantId,
      conversationId,
    );

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Check if user is a participant
    if (
      conversation.participant1Id !== userId &&
      conversation.participant2Id !== userId &&
      user.role !== 'admin'
    ) {
      throw new ForbiddenException(
        'Acesso negado. Você não é participante desta conversa.',
      );
    }

    return this.messagesService.getMessages(tenantId, conversationId, query);
  }

  @Post('conversations')
  @Roles(
    'admin',
    'coordinator',
    'secretary',
    'teacher',
    'guardian',
    'guardian_primary',
  )
  async createConversation(
    @CurrentTenant() tenantId: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser() user: UserPayload,
    @Body() body: { participant2Id: string; studentId?: string },
  ) {
    return this.messagesService.createConversation(
      tenantId,
      userId,
      body.participant2Id,
      body.studentId,
      user,
    );
  }

  @Post('conversations/:conversationId/messages')
  @Roles(
    'admin',
    'coordinator',
    'secretary',
    'teacher',
    'guardian',
    'guardian_primary',
  )
  async sendMessage(
    @CurrentTenant() tenantId: string,
    @CurrentUser('sub') userId: string,
    @Param('conversationId') conversationId: string,
    @Body() body: { content: string },
  ) {
    const message = await this.messagesService.sendMessage(
      tenantId,
      conversationId,
      userId,
      body.content,
    );

    this.messagesGateway.server
      ?.to(`conversation:${conversationId}`)
      .emit('newMessage', message);

    const conversation = await this.messagesService.getConversationById(
      tenantId,
      conversationId,
    );

    if (conversation) {
      this.messagesGateway.server
        ?.to(`user:${conversation.participant1Id}`)
        .emit('newMessage', message);
      this.messagesGateway.server
        ?.to(`user:${conversation.participant2Id}`)
        .emit('newMessage', message);
    }

    return message;
  }

  /**
   * FR19-23: Mark messages as read (bulk operation)
   */
  @Patch('conversations/:conversationId/read')
  @Roles(
    'admin',
    'coordinator',
    'secretary',
    'teacher',
    'guardian',
    'guardian_primary',
    'guardian_secondary',
  )
  async markConversationAsRead(
    @CurrentTenant() tenantId: string,
    @CurrentUser('sub') userId: string,
    @Param('conversationId') conversationId: string,
    @Body() body: { messageIds: string[] },
  ) {
    await this.messagesService.markMessagesAsRead(
      tenantId,
      conversationId,
      body.messageIds,
      userId,
    );

    // Notify other participant via WebSocket
    const conversation = await this.messagesService.getConversationById(
      tenantId,
      conversationId,
    );

    if (conversation) {
      const otherParticipantId =
        conversation.participant1Id === userId
          ? conversation.participant2Id
          : conversation.participant1Id;

      this.messagesGateway.server
        ?.to(`user:${otherParticipantId}`)
        .emit('messagesRead', {
          conversationId,
          messageIds: body.messageIds,
          readBy: userId,
          readAt: new Date().toISOString(),
        });
    }

    return { success: true };
  }
  @Roles(
    'admin',
    'coordinator',
    'secretary',
    'teacher',
    'guardian',
    'guardian_primary',
    'guardian_secondary',
  )
  async markAsRead(
    @CurrentTenant() tenantId: string,
    @Param('messageId') messageId: string,
  ) {
    const updated = await this.messagesService.markAsRead(tenantId, messageId);

    if (updated?.conversationId && updated?.readAt) {
      this.messagesGateway.server
        ?.to(`conversation:${updated.conversationId}`)
        .emit('message:read', {
          messageId: updated.id,
          conversationId: updated.conversationId,
          readAt: updated.readAt,
        });
    }

    return updated;
  }

  @Patch('conversations/:conversationId/read')
  @Roles(
    'admin',
    'coordinator',
    'secretary',
    'teacher',
    'guardian',
    'guardian_primary',
    'guardian_secondary',
  )
  async markConversationRead(
    @CurrentTenant() tenantId: string,
    @CurrentUser('sub') userId: string,
    @Param('conversationId') conversationId: string,
  ) {
    const updated = await this.messagesService.markConversationAsRead(
      tenantId,
      conversationId,
      userId,
    );
    return updated;
  }

  @Get('unread-count')
  @Roles(
    'admin',
    'coordinator',
    'secretary',
    'teacher',
    'guardian',
    'guardian_primary',
    'guardian_secondary',
  )
  async unreadCount(
    @CurrentTenant() tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    const count = await this.messagesService.getUnreadCount(tenantId, userId);
    return { count };
  }
}
