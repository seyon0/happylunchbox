import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PayoutService {
  private readonly logger = new Logger(PayoutService.name);

  constructor(private prisma: PrismaService) {}

  // Run at 00:00 every Monday
  @Cron('0 0 * * 1')
  async handleAutomatedPayouts() {
    this.logger.debug('Running Automated Payouts Job...');

    // In a real system, you would sum up completed/delivered orders
    // over the last week and calculate payouts to shops and riders.
    // For MVP, we simulate processing by finding recent orders and logging them.

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const deliveredOrders = await this.prisma.booking.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: lastWeek }
      }
    });

    if (deliveredOrders.length === 0) {
      this.logger.debug('No delivered orders found for payout.');
      return;
    }

    const shopPayouts = new Map<string, number>();
    const riderPayouts = new Map<string, number>();

    for (const order of deliveredOrders) {
      // Dummy logic: shop gets 80% of total amount
      if (order.shopId) {
        const currentShopPayout = shopPayouts.get(order.shopId) || 0;
        shopPayouts.set(order.shopId, currentShopPayout + order.totalAmount * 0.8);
      }

      // Dummy logic: rider gets fixed £3 per delivery
      if (order.riderId) {
        const currentRiderPayout = riderPayouts.get(order.riderId) || 0;
        riderPayouts.set(order.riderId, currentRiderPayout + 3.0);
      }
    }

    // Process payouts (log them or write to a transactions table)
    for (const [shopId, amount] of shopPayouts.entries()) {
      this.logger.log(`Payout to Shop ${shopId}: £${amount.toFixed(2)}`);
      // Optionally trigger Stripe transfer here
    }

    for (const [riderId, amount] of riderPayouts.entries()) {
      this.logger.log(`Payout to Rider ${riderId}: £${amount.toFixed(2)}`);
      // Optionally trigger Stripe transfer here
    }

    this.logger.log('Automated Payouts Completed');
  }
}
