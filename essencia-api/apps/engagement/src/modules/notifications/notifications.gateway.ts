import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

/**
 * Epic 9: Real-time Notifications Gateway
 * NFR4: Push notification delivery < 5s
 */
@WebSocketGateway({
  cors: {
    origin: '*', // Configure properly in production
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  handleConnection(client: Socket) {
    const userId = client.handshake.auth?.userId;
    const tenantId = client.handshake.auth?.tenantId;

    if (!userId || !tenantId) {
      this.logger.warn(`❌ Notification connection rejected: missing auth`);
      client.disconnect();
      return;
    }

    client.join(`user:${userId}`);
    client.join(`tenant:${tenantId}`);

    this.logger.log(`🔔 User ${userId} connected to notifications`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`👋 Notification socket ${client.id} disconnected`);
  }

  /**
   * Emit real-time notification to user
   * Called by NotificationsService when queueing notification
   */
  emitNotification(userId: string, notification: unknown) {
    this.server.to(`user:${userId}`).emit('notification:new', notification);
  }

  /**
   * Broadcast announcement to tenant
   */
  broadcastAnnouncement(tenantId: string, announcement: unknown) {
    this.server.to(`tenant:${tenantId}`).emit('announcement:new', announcement);
  }

  /**
   * Broadcast new diary entry to guardians
   */
  emitDiaryUpdate(guardianIds: string[], diaryEntry: unknown) {
    guardianIds.forEach((guardianId) => {
      this.server
        .to(`user:${guardianId}`)
        .emit('diary:new', { type: 'diary_update', data: diaryEntry });
    });
  }

  /**
   * Broadcast new gallery media to guardians
   */
  emitGalleryUpdate(guardianIds: string[], media: unknown) {
    guardianIds.forEach((guardianId) => {
      this.server
        .to(`user:${guardianId}`)
        .emit('gallery:new', { type: 'gallery_update', data: media });
    });
  }
}
