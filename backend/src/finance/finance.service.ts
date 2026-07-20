import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async getDashboardMetrics() {
    // Aggregation of total amounts, commissions, etc.
    // For this MVP, we query current payouts and bookings.
    const payouts = await this.prisma.payout.findMany();
    const bookings = await this.prisma.booking.findMany({ where: { status: 'COMPLETED' } });
    
    const platformRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const commissionEarned = payouts.reduce((sum, p) => sum + p.commission, 0);
    const pendingPayouts = payouts.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.netAmount, 0);
    const vatCollected = bookings.reduce((sum, b) => sum + b.vatAmount, 0);

    return {
      platformRevenue,
      commissionEarned,
      pendingPayouts,
      vatCollected
    };
  }

  async getPayouts() {
    return this.prisma.payout.findMany({
      include: {
        shop: true
      },
      orderBy: {
        periodStart: 'desc'
      }
    });
  }

  async togglePayoutHold(id: string) {
    const payout = await this.prisma.payout.findUnique({ where: { id } });
    if (!payout) throw new Error('Payout not found');
    
    return this.prisma.payout.update({
      where: { id },
      data: { isHeld: !payout.isHeld }
    });
  }

  async getWebhooks() {
    // In a real system, these would come from an event log.
    // For MVP, returning a simulated list representing Gateway Transactions.
    return [
      { event: 'payment_intent.succeeded', id: 'pi_3PZk...', time: new Date().toISOString() },
      { event: 'payout.paid', id: 'po_2QA...', time: new Date(Date.now() - 3600000).toISOString() },
      { event: 'charge.refunded', id: 'ch_3PY...', time: new Date(Date.now() - 7200000).toISOString() },
    ];
  }

  async getReconciliation() {
    // Generate mock reconciliation data for MVP
    return {
      status: 'MATCHED', // MATCHED, DISCREPANCY, PENDING
      lastRun: new Date().toISOString(),
      systemTotal: 25430.50,
      gatewayTotal: 25430.50,
      discrepancyAmount: 0.0,
      matchedTransactions: 1420,
      unmatchedTransactions: 0
    };
  }

  async getSettings() {
    let settings = await this.prisma.financeSettings.findFirst();
    if (!settings) {
      settings = await this.prisma.financeSettings.create({
        data: {
          vatStandardRate: 20.0,
          vatReducedRate: 5.0,
          vatZeroRate: 0.0,
          vatIsInclusive: false,
          platformFeeFlat: 0.50,
          gatewayMode: 'SANDBOX',
          activeProvider: 'STRIPE'
        }
      });
    }
    const deliveryRules = await this.prisma.deliveryChargeRule.findMany();
    return { ...settings, deliveryRules };
  }

  async updateSettings(body: any) {
    let settings = await this.prisma.financeSettings.findFirst();
    if (settings) {
      settings = await this.prisma.financeSettings.update({
        where: { id: settings.id },
        data: {
          vatStandardRate: body.vatStandardRate,
          vatReducedRate: body.vatReducedRate,
          vatZeroRate: body.vatZeroRate,
          vatIsInclusive: body.vatIsInclusive,
          platformFeeFlat: body.platformFeeFlat,
          gatewayMode: body.gatewayMode,
          activeProvider: body.activeProvider,
        }
      });
    }

    if (body.deliveryRules) {
      // Very basic handling: delete all and recreate for simplicity in MVP
      await this.prisma.deliveryChargeRule.deleteMany();
      for (const rule of body.deliveryRules) {
        await this.prisma.deliveryChargeRule.create({
          data: {
            name: rule.name,
            basis: rule.basis,
            minThreshold: rule.minThreshold,
            maxThreshold: rule.maxThreshold,
            feeAmount: rule.feeAmount,
            isActive: rule.isActive
          }
        });
      }
    }

    return this.getSettings();
  }
}
