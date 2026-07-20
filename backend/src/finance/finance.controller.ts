import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { FinanceService } from './finance.service';

@Controller('api/finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('dashboard')
  getDashboard() {
    return this.financeService.getDashboardMetrics();
  }

  @Get('payouts')
  getPayouts() {
    return this.financeService.getPayouts();
  }

  @Get('reconciliation')
  getReconciliation() {
    return this.financeService.getReconciliation();
  }

  @Post('payouts/:id/hold')
  togglePayoutHold(@Param('id') id: string) {
    return this.financeService.togglePayoutHold(id);
  }

  @Get('webhooks')
  getWebhooks() {
    return this.financeService.getWebhooks();
  }

  @Get('settings')
  getSettings() {
    return this.financeService.getSettings();
  }

  @Put('settings')
  updateSettings(@Body() body: any) {
    return this.financeService.updateSettings(body);
  }
}
