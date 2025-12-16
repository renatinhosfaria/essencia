import * as schema from '@app/database';
import {
  DB,
  notificationQueue,
  studentGuardians,
  students,
  users,
} from '@app/database';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { and, eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { v4 as uuidv4 } from 'uuid';

/**
 * Interface para configurações de notificação
 * TODO: Implementar tabela notificationSettings no schema
 */
interface NotificationSettings {
  enableMessageNotifications: boolean;
  enableDiaryNotifications: boolean;
  enableAnnouncementNotifications: boolean;
  enableGalleryNotifications: boolean;
}

/**
 * Service para disparar notificações em resposta a eventos
 * Implementa FR40 (configurações da escola) e gatilhos automáticos
 */
@Injectable()
export class NotificationTriggersService {
  private readonly logger = new Logger(NotificationTriggersService.name);

  constructor(@Inject(DB) private readonly db: NodePgDatabase<typeof schema>) {}

  /**
   * Dispara notificação quando uma nova mensagem é enviada
   */
  async onNewMessage(params: {
    tenantId: string;
    senderId: string;
    recipientId: string;
    messageContent: string;
    senderName: string;
  }): Promise<void> {
    try {
      // Verificar configurações da escola
      const settings = await this.getNotificationSettings(params.tenantId);
      if (!settings?.enableMessageNotifications) {
        this.logger.debug('Message notifications disabled for tenant');
        return;
      }

      // Enfileirar notificação
      await this.db.insert(notificationQueue).values({
        tenantId: params.tenantId,
        userId: params.recipientId,
        title: `Nova mensagem de ${params.senderName}`,
        body: params.messageContent.substring(0, 100),
        data: {
          type: 'new_message',
          senderId: params.senderId,
        },
        status: 'pending',
        priority: 'normal',
      });
    } catch (error) {
      this.logger.error('Failed to trigger message notification', error);
    }
  }

  /**
   * Dispara notificação quando um diário é criado/atualizado
   */
  async onDiaryUpdate(params: {
    tenantId: string;
    studentId: string;
    date: string;
    createdBy: string;
  }): Promise<void> {
    try {
      // Verificar configurações da escola
      const settings = await this.getNotificationSettings(params.tenantId);
      if (!settings?.enableDiaryNotifications) {
        this.logger.debug('Diary notifications disabled for tenant');
        return;
      }

      // Buscar responsáveis do aluno
      const guardians = await this.getStudentGuardians(
        params.tenantId,
        params.studentId,
      );

      if (guardians.length === 0) {
        this.logger.debug(`No guardians found for student ${params.studentId}`);
        return;
      }

      // Buscar informações do aluno
      const [student] = await this.db
        .select()
        .from(students)
        .where(
          and(
            eq(students.tenantId, params.tenantId),
            eq(students.id, params.studentId),
          ),
        )
        .limit(1);

      if (!student) return;

      // Criar notificações para cada responsável
      const batchId = uuidv4();
      const notifications = guardians.map((guardianId) => ({
        tenantId: params.tenantId,
        userId: guardianId,
        title: `Novo diário de ${student.name}`,
        body: `O diário do dia ${params.date} foi atualizado`,
        data: {
          type: 'diary_update',
          studentId: params.studentId,
          date: params.date,
        },
        status: 'pending' as const,
        priority: 'normal' as const,
        batchId, // Agrupar notificações relacionadas
      }));

      await this.db.insert(notificationQueue).values(notifications);
    } catch (error) {
      this.logger.error('Failed to trigger diary notification', error);
    }
  }

  /**
   * Dispara notificação quando um comunicado é criado
   */
  async onAnnouncementCreated(params: {
    tenantId: string;
    announcementId: string;
    title: string;
    targetAudience: string[];
    classIds?: string[];
  }): Promise<void> {
    try {
      // Verificar configurações da escola
      const settings = await this.getNotificationSettings(params.tenantId);
      if (!settings?.enableAnnouncementNotifications) {
        this.logger.debug('Announcement notifications disabled for tenant');
        return;
      }

      // Determinar destinatários baseado no público-alvo
      const recipientIds = await this.getAnnouncementRecipients(
        params.tenantId,
        params.targetAudience,
        params.classIds,
      );

      if (recipientIds.length === 0) {
        this.logger.debug('No recipients found for announcement');
        return;
      }

      // Criar notificações em batch
      const batchId = uuidv4();
      const notifications = recipientIds.map((userId) => ({
        tenantId: params.tenantId,
        userId,
        title: 'Novo comunicado',
        body: params.title,
        data: {
          type: 'announcement',
          announcementId: params.announcementId,
        },
        status: 'pending' as const,
        priority: 'high' as const, // Comunicados têm prioridade alta
        batchId,
      }));

      await this.db.insert(notificationQueue).values(notifications);
    } catch (error) {
      this.logger.error('Failed to trigger announcement notification', error);
    }
  }

  /**
   * Dispara notificação quando uma galeria é criada
   */
  async onGalleryPostCreated(params: {
    tenantId: string;
    postId: string;
    classId: string;
    title: string;
  }): Promise<void> {
    try {
      // Verificar configurações da escola
      const settings = await this.getNotificationSettings(params.tenantId);
      if (!settings?.enableGalleryNotifications) {
        this.logger.debug('Gallery notifications disabled for tenant');
        return;
      }

      // Buscar responsáveis dos alunos da turma
      const guardians = await this.getClassGuardians(
        params.tenantId,
        params.classId,
      );

      if (guardians.length === 0) {
        this.logger.debug(`No guardians found for class ${params.classId}`);
        return;
      }

      // Criar notificações em batch
      const batchId = uuidv4();
      const notifications = guardians.map((guardianId) => ({
        tenantId: params.tenantId,
        userId: guardianId,
        title: 'Novas fotos na galeria',
        body: params.title,
        data: {
          type: 'gallery_post',
          postId: params.postId,
          classId: params.classId,
        },
        status: 'pending' as const,
        priority: 'normal' as const,
        batchId,
      }));

      await this.db.insert(notificationQueue).values(notifications);
    } catch (error) {
      this.logger.error('Failed to trigger gallery notification', error);
    }
  }

  /**
   * Busca configurações de notificação da escola
   * TODO: Implementar tabela notificationSettings no schema
   * Por enquanto, retorna configurações padrão habilitando todas as notificações
   */
  private async getNotificationSettings(
    tenantId: string,
  ): Promise<NotificationSettings> {
    // TODO: Buscar de tabela notificationSettings quando implementada
    // Por enquanto, todas as notificações estão habilitadas por padrão
    this.logger.debug(
      `Getting notification settings for tenant ${tenantId} (using defaults)`,
    );
    return {
      enableMessageNotifications: true,
      enableDiaryNotifications: true,
      enableAnnouncementNotifications: true,
      enableGalleryNotifications: true,
    };
  }

  /**
   * Busca responsáveis de um aluno usando a tabela studentGuardians
   */
  private async getStudentGuardians(
    tenantId: string,
    studentId: string,
  ): Promise<string[]> {
    const guardianRelations = await this.db
      .select({ guardianId: studentGuardians.guardianId })
      .from(studentGuardians)
      .where(
        and(
          eq(studentGuardians.tenantId, tenantId),
          eq(studentGuardians.studentId, studentId),
        ),
      );

    return guardianRelations.map((g) => g.guardianId);
  }

  /**
   * Busca responsáveis de todos os alunos de uma turma
   */
  private async getClassGuardians(
    tenantId: string,
    classId: string,
  ): Promise<string[]> {
    // Primeiro, busca todos os alunos da turma
    const classStudents = await this.db
      .select({ id: students.id })
      .from(students)
      .where(
        and(eq(students.tenantId, tenantId), eq(students.classId, classId)),
      );

    if (classStudents.length === 0) return [];

    const studentIds = classStudents.map((s) => s.id);

    // Depois, busca todos os responsáveis desses alunos
    const guardianRelations = await this.db
      .select({ guardianId: studentGuardians.guardianId })
      .from(studentGuardians)
      .where(
        and(
          eq(studentGuardians.tenantId, tenantId),
          inArray(studentGuardians.studentId, studentIds),
        ),
      );

    // Remove duplicatas
    const guardianIds = new Set<string>();
    for (const g of guardianRelations) {
      guardianIds.add(g.guardianId);
    }

    return Array.from(guardianIds);
  }

  /**
   * Determina destinatários de um comunicado baseado no público-alvo
   */
  private async getAnnouncementRecipients(
    tenantId: string,
    targetAudience: string[],
    classIds?: string[],
  ): Promise<string[]> {
    const recipientIds = new Set<string>();

    for (const audience of targetAudience) {
      if (audience === 'guardians') {
        // Buscar todos os responsáveis (ou de turmas específicas)
        let studentsList;
        if (classIds && classIds.length > 0) {
          studentsList = await this.db
            .select({ id: students.id })
            .from(students)
            .where(
              and(
                eq(students.tenantId, tenantId),
                inArray(students.classId, classIds),
              ),
            );
        } else {
          studentsList = await this.db
            .select({ id: students.id })
            .from(students)
            .where(eq(students.tenantId, tenantId));
        }

        if (studentsList.length > 0) {
          const studentIds = studentsList.map((s) => s.id);

          // Buscar responsáveis desses alunos
          const guardianRelations = await this.db
            .select({ guardianId: studentGuardians.guardianId })
            .from(studentGuardians)
            .where(
              and(
                eq(studentGuardians.tenantId, tenantId),
                inArray(studentGuardians.studentId, studentIds),
              ),
            );

          for (const g of guardianRelations) {
            recipientIds.add(g.guardianId);
          }
        }
      } else {
        // Buscar usuários por role (teachers, staff, etc)
        const usersList = await this.db
          .select()
          .from(users)
          .where(and(eq(users.tenantId, tenantId), eq(users.role, audience)));

        for (const user of usersList) {
          recipientIds.add(user.id);
        }
      }
    }

    return Array.from(recipientIds);
  }
}
