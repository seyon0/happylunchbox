import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StockSchedulerService {
  private readonly logger = new Logger(StockSchedulerService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleAutoReEnable() {
    this.logger.log('Checking for items to auto re-enable...');
    const now = new Date();

    const updatedItems = await this.prisma.menuItem.updateMany({
      where: {
        isAvailable: false,
        autoReEnableAt: { lte: now }
      },
      data: {
        isAvailable: true,
        autoReEnableAt: null
      }
    });
    if (updatedItems.count > 0) {
      this.logger.log(`Auto re-enabled ${updatedItems.count} MenuItems`);
    }

    const updatedVariants = await this.prisma.itemVariant.updateMany({
      where: {
        isAvailable: false,
        autoReEnableAt: { lte: now }
      },
      data: {
        isAvailable: true,
        autoReEnableAt: null
      }
    });
    if (updatedVariants.count > 0) {
      this.logger.log(`Auto re-enabled ${updatedVariants.count} ItemVariants`);
    }

    const updatedAddOns = await this.prisma.addOnItem.updateMany({
      where: {
        isAvailable: false,
        autoReEnableAt: { lte: now }
      },
      data: {
        isAvailable: true,
        autoReEnableAt: null
      }
    });
    if (updatedAddOns.count > 0) {
      this.logger.log(`Auto re-enabled ${updatedAddOns.count} AddOnItems`);
    }
  }
}
