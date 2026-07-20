import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findOneById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findOneByPhone(phone: string) {
    return this.prisma.user.findFirst({ where: { phone } });
  }

  async create(userData: any) {
    const existing = await this.findOneByEmail(userData.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async upsertOAuthUser(userData: any) {
    const existing = await this.findOneByEmail(userData.email);
    if (existing) {
      // If logging in via OAuth but existing user, link them
      if (existing.provider === 'LOCAL') {
        return this.prisma.user.update({
          where: { id: existing.id },
          data: { provider: userData.provider, providerId: userData.providerId },
        });
      }
      return existing;
    }
    
    // Create new OAuth user
    return this.prisma.user.create({
      data: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        provider: userData.provider,
        providerId: userData.providerId,
        isVerified: true, // OAuth is verified implicitly
      },
    });
  }

  async addPoints(userId: string, points: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        loyaltyPoints: { increment: points }
      }
    });
  }

  async getPoints(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { loyaltyPoints: true }
    });
    return user ? user.loyaltyPoints : 0;
  }
}
