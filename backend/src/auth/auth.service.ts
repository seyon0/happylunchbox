import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.password && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, ipAddress?: string, userAgent?: string) {
    const sessionId = require('crypto').randomBytes(32).toString('hex');
    const payload = { email: user.email, sub: user.id, role: user.role, sessionId };
    const access_token = this.jwtService.sign(payload);
    
    // Concurrent session limit: limit to 1 active session per user
    await this.prisma.session.updateMany({
      where: { userId: user.id, isRevoked: false },
      data: { isRevoked: true }
    });

    // Create new session
    await this.prisma.session.create({
      data: {
        userId: user.id,
        tokenHash: sessionId, // In a real app we might hash the access_token, but sessionId is sufficient for tracking
        ipAddress,
        userAgent,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        isRevoked: false,
      }
    });

    // Fetch shop staff roles to include in login response
    const shopStaff = await this.prisma.shopStaff.findMany({
      where: { userId: user.id },
      include: { shop: { select: { id: true, name: true, isOperating: true } } }
    });

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        walletBalance: user.walletBalance,
        shopStaff: shopStaff.map(s => ({
          shopId: s.shopId,
          role: s.role,
          shopName: s.shop.name
        }))
      }
    };
  }

  async logout(sessionId: string) {
    if (!sessionId) return;
    await this.prisma.session.update({
      where: { tokenHash: sessionId },
      data: { isRevoked: true }
    });
  }

  async forceLogout(userId: string) {
    await this.prisma.session.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true }
    });
  }

  async requestPasswordReset(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      // Return success anyway to prevent email enumeration
      return { message: 'If the email exists, a password reset link has been sent.' };
    }

    const resetToken = require('crypto').randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt
      }
    });

    // Send email using central SMTP config (mocked via emailService)
    await this.emailService.sendOTP(email, `Your password reset token is: ${resetToken}\nOr click: http://localhost:5173/reset-password?token=${resetToken}`);

    return { message: 'Password reset link sent.' };
  }

  async triggerOTP(userId: string) {
    const user = await this.usersService.findOneById(userId);
    if (!user) throw new NotFoundException('User not found');
    
    // Generate 6 digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    
    await this.prisma.user.update({
      where: { id: userId },
      data: { otpCode, otpExpiry },
    });

    await this.emailService.sendOTP(user.email, otpCode);

    return { message: 'OTP sent successfully', userId };
  }

  async verifyOTP(userId: string, otpCode: string) {
    const user = await this.usersService.findOneById(userId);
    if (!user || user.otpCode !== otpCode) return null;
    
    if (user.otpExpiry && new Date() > user.otpExpiry) {
      throw new UnauthorizedException('OTP has expired');
    }
    
    // Clear OTP and set verified
    await this.prisma.user.update({
      where: { id: userId },
      data: { otpCode: null, otpExpiry: null, isVerified: true },
    });
    
    return user;
  }

  async getSmtpConfig(userId: string) {
    const config = await this.prisma.smtpConfig.findUnique({ where: { userId } });
    if (!config) return null;
    return { emailAddress: config.emailAddress, portalType: config.portalType };
  }

  async updateSmtpConfig(userId: string, data: any) {
    const encryptedPassword = this.emailService.encrypt(data.appPassword);
    return this.prisma.smtpConfig.upsert({
      where: { userId },
      update: { emailAddress: data.emailAddress, encryptedAppPassword: encryptedPassword },
      create: { 
        userId, 
        portalType: data.portalType || 'ADMIN', 
        emailAddress: data.emailAddress, 
        encryptedAppPassword: encryptedPassword 
      },
    });
  }
  async getSessions(userId: string) {
    return this.prisma.session.findMany({
      where: { userId, isRevoked: false },
      select: { id: true, ipAddress: true, userAgent: true, createdAt: true, expiresAt: true }
    });
  }

  async revokeSession(userId: string, sessionId: string) {
    return this.prisma.session.updateMany({
      where: { id: sessionId, userId, isRevoked: false },
      data: { isRevoked: true }
    });
  }
}
