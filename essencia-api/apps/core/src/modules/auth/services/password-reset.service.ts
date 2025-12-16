import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { eq, and, isNull } from 'drizzle-orm';
import { DB, DrizzleDB, passwordResetTokens } from '@app/database';
import { UsersService } from '../../users/users.service';
import { TenantsService } from '../../tenants/tenants.service';
import { EmailService } from './email.service';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PasswordResetService {
  private readonly tokenTtlMs = 60 * 60 * 1000; // 1 hour

  constructor(
    @Inject(DB) private readonly db: DrizzleDB,
    private readonly usersService: UsersService,
    private readonly tenantsService: TenantsService,
    private readonly emailService: EmailService,
  ) {}

  async requestReset(email: string, tenantSlug: string): Promise<void> {
    const tenant = await this.tenantsService.findBySlug(tenantSlug);
    if (!tenant) return; // Silent fail for security

    const user = await this.usersService.findByEmail(tenant.id, email);
    if (!user) return; // Silent fail for security

    const token = uuidv4();
    const expiresAt = Date.now() + this.tokenTtlMs;

    await this.db.insert(passwordResetTokens).values({
      id: uuidv4(),
      tenantId: tenant.id,
      userId: user.id,
      token,
      expiresAt: new Date(expiresAt),
    });

    await this.emailService.sendPasswordResetEmail(email, token, tenant.name);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const now = new Date();
    const existing = await this.db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.token, token),
          isNull(passwordResetTokens.usedAt),
        ),
      )
      .limit(1);

    const storedToken = existing[0];
    if (!storedToken || storedToken.expiresAt < now) {
      throw new BadRequestException('Invalid or expired token');
    }

    const passwordHash = await argon2.hash(newPassword);
    await this.usersService.updatePassword(
      storedToken.tenantId,
      storedToken.userId,
      passwordHash,
    );

    await this.db
      .update(passwordResetTokens)
      .set({ usedAt: now })
      .where(eq(passwordResetTokens.id, storedToken.id));
  }
}
