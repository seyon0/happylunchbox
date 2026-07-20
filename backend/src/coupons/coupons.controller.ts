import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CouponsService } from './coupons.service';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validateCoupon(@Body('code') code: string) {
    return this.couponsService.validate(code);
  }
}
