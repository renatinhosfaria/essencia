import { Injectable, Logger } from '@nestjs/common';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';

@Injectable()
export class ExpoPushService {
  private readonly logger = new Logger(ExpoPushService.name);
  private readonly expo = new Expo();

  async send(params: {
    tokens: string[];
    title: string;
    body: string;
    data?: Record<string, unknown>;
    imageUrl?: string | null;
  }): Promise<void> {
    const validTokens = params.tokens.filter((token) =>
      Expo.isExpoPushToken(token),
    );

    if (validTokens.length === 0) {
      this.logger.debug('No valid Expo push tokens; skipping send');
      return;
    }

    const messages: ExpoPushMessage[] = validTokens.map((to) => ({
      to,
      title: params.title,
      body: params.body,
      data: params.data,
      sound: 'default',
      ...(params.imageUrl ? { image: params.imageUrl } : null),
    }));

    const chunks = this.expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      try {
        const tickets = await this.expo.sendPushNotificationsAsync(chunk);

        for (const ticket of tickets) {
          if (ticket.status === 'error') {
            this.logger.warn(
              `Expo push ticket error: ${ticket.message ?? 'unknown'} (${ticket.details ? JSON.stringify(ticket.details) : 'no details'})`,
            );
          }
        }
      } catch (error) {
        this.logger.error(
          'Failed to send Expo push notifications chunk',
          error,
        );
        throw error;
      }
    }
  }
}
