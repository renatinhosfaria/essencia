import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  async sendPasswordResetEmail(
    email: string,
    token: string,
    tenantName: string,
  ): Promise<void> {
    const baseUrl = this.configService.get<string>('APP_URL', 'http://localhost:3000');
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    console.log(`[EMAIL] Password reset email to ${email}`);
    console.log(`[EMAIL] Reset URL: ${resetUrl}`);
    console.log(`[EMAIL] Tenant: ${tenantName}`);
  }

  async sendInvitationEmail(
    email: string,
    token: string,
    tenantName: string,
    inviterName: string,
  ): Promise<void> {
    const baseUrl = this.configService.get<string>('APP_URL', 'http://localhost:3000');
    const registerUrl = `${baseUrl}/register?token=${token}`;

    console.log(`[EMAIL] Invitation email to ${email}`);
    console.log(`[EMAIL] Register URL: ${registerUrl}`);
    console.log(`[EMAIL] Invited by: ${inviterName} at ${tenantName}`);
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    console.log(`[EMAIL] Welcome email to ${email}`);
    console.log(`[EMAIL] Name: ${name}`);
  }
}
