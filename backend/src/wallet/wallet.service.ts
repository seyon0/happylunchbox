import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getBalance(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return { balance: user.walletBalance };
  }

  async getTransactions(userId: string) {
    return this.prisma.walletTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async addFunds(userId: string, amount: number, reason: string = 'Added funds via Top Up') {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
    
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: userId },
        data: { walletBalance: { increment: amount } }
      });

      await tx.walletTransaction.create({
        data: {
          userId,
          type: 'CREDIT',
          amount,
          reason,
        }
      });

      return user;
    });
  }

  async deductFunds(userId: string, amount: number, reason: string = 'Payment Deduction') {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
    
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');
      if (user.walletBalance < amount) {
        throw new BadRequestException('Insufficient funds');
      }

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { walletBalance: { decrement: amount } }
      });

      await tx.walletTransaction.create({
        data: {
          userId,
          type: 'DEBIT',
          amount,
          reason,
        }
      });

      return updatedUser;
    });
  }
}
