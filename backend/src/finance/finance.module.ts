import { Module } from '@nestjs/common';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { PayoutService } from './payout.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [FinanceController],
  providers: [FinanceService, PayoutService, PrismaService],
})
export class FinanceModule {}
