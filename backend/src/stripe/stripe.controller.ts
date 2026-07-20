import {
  Controller, Post, Body, Headers, Req, UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { StripeService } from './stripe.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-payment-intent')
  createPaymentIntent(@Body() body: { amount: number; bookingId: string }) {
    return this.stripeService.createPaymentIntent(body.amount, 'gbp', {
      bookingId: body.bookingId,
    });
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request & { rawBody?: Buffer },
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = (req as any).rawBody as Buffer;
    return this.stripeService.handleWebhook(rawBody, signature);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('trigger-payout')
  triggerPayout(
    @Body() body: { shopId: string; amount: number; description: string },
  ) {
    return this.stripeService.triggerVendorPayout(
      body.shopId,
      body.amount,
      body.description,
    );
  }
}
