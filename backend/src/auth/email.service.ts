import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  // In production, ENCRYPTION_KEY should be 32 bytes and stored in env.
  private readonly ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012';
  private readonly IV_LENGTH = 16;

  constructor(private prisma: PrismaService) {}

  encrypt(text: string): string {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  decrypt(text: string): string {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift() as string, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

  async sendOTP(email: string, otpCode: string) {
    const smtpConfig = await this.prisma.smtpConfig.findFirst({
      where: { portalType: 'ADMIN' },
    });

    if (!smtpConfig) {
      this.logger.warn(`No SMTP Config found. Falling back to Console. OTP for ${email}: ${otpCode}`);
      return;
    }

    try {
      const password = this.decrypt(smtpConfig.encryptedAppPassword);
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Standardizing on Gmail App Passwords for ease of use
        auth: {
          user: smtpConfig.emailAddress,
          pass: password,
        },
      });

      await transporter.sendMail({
        from: `"Healthy Lunchbox" <${smtpConfig.emailAddress}>`,
        to: email,
        subject: 'Your One-Time Password (OTP)',
        text: `Your verification code is: ${otpCode}. It will expire in 15 minutes.`,
      });
      this.logger.log(`OTP sent to ${email} via SMTP.`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}. Check SMTP credentials.`, error);
      this.logger.warn(`Fallback Console OTP for ${email}: ${otpCode}`);
    }
  }
}
