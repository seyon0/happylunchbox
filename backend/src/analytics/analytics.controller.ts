import { Controller, Get, Query, Res } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import type { Response } from 'express';

@Controller('api/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('sales')
  getSalesAnalytics() {
    return this.analyticsService.getSalesAnalytics();
  }

  @Get('customers')
  getCustomerAnalytics() {
    return this.analyticsService.getCustomerAnalytics();
  }

  @Get('riders')
  getRiderAnalytics() {
    return this.analyticsService.getRiderAnalytics();
  }

  @Get('export')
  async exportData(@Query('dataset') dataset: string, @Res() res: Response) {
    const csvContent = await this.analyticsService.generateExport(dataset);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=export-${dataset}-${Date.now()}.csv`);
    res.send(csvContent);
  }

  @Get('bi-export')
  async getBiExport() {
    return this.analyticsService.getBiExport();
  }
}
