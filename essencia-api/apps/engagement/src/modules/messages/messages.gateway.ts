import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/messages',
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>(); // socketId -> userId

  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; tenantId: string },
  ) {
    this.connectedUsers.set(client.id, data.userId);
    (client.data as any).userId = data.userId;
    (client.data as any).tenantId = data.tenantId;
    client.join(`user:${data.userId}`);
    client.join(`tenant:${data.tenantId}`);
    console.log(`User ${data.userId} joined rooms`);
  }

  @SubscribeMessage('joinConversation')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.join(`conversation:${data.conversationId}`);
    console.log(`Client joined conversation: ${data.conversationId}`);
  }

  @SubscribeMessage('leaveConversation')
  handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.leave(`conversation:${data.conversationId}`);
    console.log(`Client left conversation: ${data.conversationId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      tenantId: string;
      conversationId: string;
      senderId: string;
      content: string;
    },
  ) {
    const message = await this.messagesService.sendMessage(
      data.tenantId,
      data.conversationId,
      data.senderId,
      data.content,
    );

    // Emit to all users in the conversation
    this.server
      .to(`conversation:${data.conversationId}`)
      .emit('newMessage', message);

    const conversation = await this.messagesService.getConversationById(
      data.tenantId,
      data.conversationId,
    );

    if (conversation) {
      this.server
        .to(`user:${conversation.participant1Id}`)
        .emit('newMessage', message);
      this.server
        .to(`user:${conversation.participant2Id}`)
        .emit('newMessage', message);
    }

    return message;
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; userId: string },
  ) {
    client.to(`conversation:${data.conversationId}`).emit('userTyping', {
      userId: data.userId,
      conversationId: data.conversationId,
    });
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; userId: string },
  ) {
    client.to(`conversation:${data.conversationId}`).emit('userStoppedTyping', {
      userId: data.userId,
      conversationId: data.conversationId,
    });
  }

  @SubscribeMessage('message:read')
  async handleMessageRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; messageIds: string[] },
  ) {
    const userId = (client.data as any)?.userId as string | undefined;
    const tenantId = (client.data as any)?.tenantId as string | undefined;

    if (!userId || !tenantId) {
      return { error: 'Unauthorized' };
    }

    const updated = await this.messagesService.markMessagesAsRead(
      tenantId,
      data.conversationId,
      data.messageIds,
      userId,
    );

    for (const message of updated) {
      this.server
        .to(`conversation:${data.conversationId}`)
        .emit('message:read', {
          messageId: message.id,
          conversationId: data.conversationId,
          readAt: message.readAt,
        });
    }

    return { updatedCount: updated.length };
  }
}
