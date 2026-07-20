import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/wallet')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Roles('CUSTOMER', 'RIDER', 'KITCHEN')
  @Get('balance')
  getBalance(@Request() req: any) {
    return this.walletService.getBalance(req.user.userId);
  }

  @Roles('CUSTOMER')
  @Post('add')
  addFunds(@Body('amount') amount: number, @Request() req: any) {
    return this.walletService.addFunds(req.user.userId, amount);
  }

  @Roles('CUSTOMER')
  @Post('deduct')
  deductFunds(@Body('amount') amount: number, @Request() req: any) {
    return this.walletService.deductFunds(req.user.userId, amount);
  }
  @Roles('CUSTOMER', 'RIDER', 'KITCHEN')
  @Get('transactions')
  getTransactions(@Request() req: any) {
    return this.walletService.getTransactions(req.user.userId);
  }
}
