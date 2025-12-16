import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from '@app/database';
import { CacheModule } from '@app/cache';
import { StorageModule } from '@app/storage';
import { DiaryModule } from './modules/diary/diary.module';
import { MessagesModule } from './modules/messages/messages.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { HealthController } from './health.controller';
import { JwtAuthGuard, RolesGuard } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    DrizzleModule,
    CacheModule,
    StorageModule,
    DiaryModule,
    MessagesModule,
    AnnouncementsModule,
    GalleryModule,
    NotificationsModule,
  ],
  controllers: [HealthController],
  providers: [JwtAuthGuard, RolesGuard],
})
export class EngagementModule {}
