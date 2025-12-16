import { Module } from '@nestjs/common';
import { ExpoPushService } from './expo-push.service';
import { NotificationTriggersService } from './notification-triggers.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { NotificationsWorker } from './notifications.worker';

@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    ExpoPushService,
    NotificationsWorker,
    NotificationTriggersService,
    NotificationsGateway,
  ],
  exports: [
    NotificationsService,
    NotificationTriggersService,
    NotificationsGateway,
  ],
})
export class NotificationsModule {}
