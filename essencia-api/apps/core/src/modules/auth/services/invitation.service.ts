import { Injectable, Inject } from '@nestjs/common';
import { eq, and, isNull } from 'drizzle-orm';
import { DB, DrizzleDB } from '@app/database';
import * as schema from '@app/database/schema';
import { v4 as uuidv4 } from 'uuid';

export interface Invitation {
  id: string;
  tenantId: string;
  email: string;
  role: string;
  token: string;
  expiresAt: Date;
  usedAt: Date | null;
}

@Injectable()
export class InvitationService {
  constructor(@Inject(DB) private readonly db: DrizzleDB) {}

  async create(
    tenantId: string,
    email: string,
    role: string,
  ): Promise<Invitation> {
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const [invitation] = await this.db
      .insert(schema.invitations)
      .values({
        id: uuidv4(),
        tenantId,
        email: email.toLowerCase(),
        role,
        token,
        expiresAt,
      })
      .returning();

    return invitation as Invitation;
  }

  async validateToken(token: string): Promise<Invitation | null> {
    const result = await this.db
      .select()
      .from(schema.invitations)
      .where(and(eq(schema.invitations.token, token), isNull(schema.invitations.usedAt)))
      .limit(1);

    const invitation = result[0] as Invitation | undefined;

    if (!invitation) return null;
    if (invitation.expiresAt && invitation.expiresAt < new Date()) return null;

    return invitation;
  }

  async markAsUsed(token: string): Promise<void> {
    await this.db
      .update(schema.invitations)
      .set({ usedAt: new Date() })
      .where(eq(schema.invitations.token, token));
  }
}
