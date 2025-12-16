import { DB, DrizzleDB, notificationQueue } from '@app/database';
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { and, asc, eq, isNull, lte, or } from 'drizzle-orm';
import { ExpoPushService } from './expo-push.service';
import { NotificationsService } from './notifications.service';

@Injectable()
export class NotificationsWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationsWorker.name);
  private timer: NodeJS.Timeout | undefined;
  private isTickRunning = false;

  constructor(
    @Inject(DB) private readonly db: DrizzleDB,
    private readonly notificationsService: NotificationsService,
    private readonly expoPushService: ExpoPushService,
  ) {}

  onModuleInit() {
    const enabled =
      (process.env.NOTIFICATIONS_WORKER_ENABLED ?? 'true').toLowerCase() !==
      'false';
    if (!enabled) {
      this.logger.log(
        'Notifications worker disabled (NOTIFICATIONS_WORKER_ENABLED=false)',
      );
      return;
    }

    const intervalMs =
      Number.parseInt(process.env.NOTIFICATIONS_WORKER_INTERVAL_MS ?? '', 10) ||
      2000;

    this.logger.log(`Notifications worker enabled (interval ${intervalMs}ms)`);
    this.timer = setInterval(() => {
      void this.tick().catch((err) =>
        this.logger.error('Worker tick failed', err),
      );
    }, intervalMs);
    this.timer.unref();
  }

  onModuleDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  private async tick(): Promise<void> {
    if (this.isTickRunning) return;
    this.isTickRunning = true;

    try {
      const limit =
        Number.parseInt(
          process.env.NOTIFICATIONS_WORKER_BATCH_SIZE ?? '',
          10,
        ) || 10;
      const now = new Date();

      // Buscar notificações pendentes
      const pending = await this.db
        .select()
        .from(notificationQueue)
        .where(
          and(
            eq(notificationQueue.status, 'pending'),
            or(
              isNull(notificationQueue.scheduledFor),
              lte(notificationQueue.scheduledFor, now),
            ),
          ),
        )
        .orderBy(asc(notificationQueue.createdAt))
        .limit(limit);

      // Processar notificações individuais
      for (const job of pending) {
        const [claimed] = await this.db
          .update(notificationQueue)
          .set({
            status: 'processing',
            attempts: (job.attempts ?? 0) + 1,
          })
          .where(
            and(
              eq(notificationQueue.id, job.id),
              eq(notificationQueue.status, 'pending'),
            ),
          )
          .returning();

        if (!claimed) {
          continue;
        }

        await this.processJob(claimed);
      }
    } finally {
      this.isTickRunning = false;
    }
  }

  private async processJob(
    job: typeof notificationQueue.$inferSelect,
  ): Promise<void> {
    try {
      const tokens = await this.notificationsService.getUserDeviceTokens(
        job.tenantId,
        job.userId,
      );
      const expoTokens = tokens
        .map((t) => t.token)
        .filter((t): t is string => typeof t === 'string' && t.length > 0);

      if (expoTokens.length === 0) {
        const shouldFail = (job.attempts ?? 0) >= (job.maxAttempts ?? 3);
        await this.db
          .update(notificationQueue)
          .set({
            status: shouldFail ? 'failed' : 'pending',
            scheduledFor: shouldFail ? null : new Date(Date.now() + 15_000),
          })
          .where(eq(notificationQueue.id, job.id));

        return;
      }

      // Enviar via Expo
      await this.expoPushService.send({
        tokens: expoTokens,
        title: job.title,
        body: job.body,
        data: (job.data as any) ?? {},
        imageUrl: job.imageUrl,
      });

      // Marcar como enviado com métricas
      await this.db
        .update(notificationQueue)
        .set({
          status: 'sent',
          sentAt: new Date(),
        })
        .where(eq(notificationQueue.id, job.id));
    } catch (error) {
      this.logger.warn(`Failed to deliver notification job ${job.id}`, error);

      const shouldFail = (job.attempts ?? 0) >= (job.maxAttempts ?? 3);

      await this.db
        .update(notificationQueue)
        .set({
          status: shouldFail ? 'failed' : 'pending',
          scheduledFor: shouldFail ? null : new Date(Date.now() + 30_000),
        })
        .where(eq(notificationQueue.id, job.id));
    }
  }
}
