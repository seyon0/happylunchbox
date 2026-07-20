import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
  }

  async createPaymentIntent(
    amount: number,
    currency = 'gbp',
    metadata: Record<string, string> = {},
  ) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses pence
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    });
    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err: any) {
      this.logger.error('Webhook signature verification failed:', err.message);
      throw new Error('Webhook verification failed');
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent;
        const bookingId = pi.metadata?.bookingId;
        if (bookingId) {
          await this.prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'ACCEPTED', paymentGateway: 'STRIPE' },
          });
          this.logger.log(
            `Booking ${bookingId} confirmed via Stripe payment intent ${pi.id}`,
          );
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent;
        const bookingId = pi.metadata?.bookingId;
        if (bookingId) {
          await this.prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'CANCELLED', refundStatus: 'REJECTED' },
          });
          this.logger.warn(`Booking ${bookingId} payment failed.`);
        }
        break;
      }
      case 'payout.paid': {
        const payout = event.data.object as Stripe.Payout;
        this.logger.log(`Payout paid: ${payout.id} - Amount: ${payout.amount}`);
        await this.prisma.payout.updateMany({
          where: { gatewayRef: payout.id },
          data: { status: 'PAID', settledAt: new Date() },
        });
        break;
      }
      default:
        this.logger.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return { received: true };
  }

  async triggerVendorPayout(shopId: string, amount: number, description: string) {
    // In production this would use Stripe Connect transfers
    this.logger.log(`Triggering payout for shop ${shopId}: £${amount} — ${description}`);
    return {
      success: true,
      message: `Payout of £${amount.toFixed(2)} queued for shop ${shopId}`,
    };
  }
}
