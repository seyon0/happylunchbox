import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async validate(code: string) {
    if (!code) {
      throw new BadRequestException('Coupon code is required.');
    }

    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      throw new BadRequestException('Invalid promo code.');
    }

    if (!coupon.isActive) {
      throw new BadRequestException('This promo code is no longer active.');
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw new BadRequestException('This promo code has expired.');
    }

    if (coupon.usageLimit && coupon.currentUsage >= coupon.usageLimit) {
      throw new BadRequestException('This promo code has reached its usage limit.');
    }

    return {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      label: coupon.type === 'PERCENTAGE' 
        ? `${coupon.value}% off` 
        : `£${coupon.value.toFixed(2)} off`,
    };
  }
}
