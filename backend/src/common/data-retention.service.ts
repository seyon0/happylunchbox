import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DataRetentionService {
  private readonly logger = new Logger(DataRetentionService.name);

  constructor(private prisma: PrismaService) {}

  // In a real app, this would be a @Cron() job
  async runRetentionPolicy() {
    this.logger.log('Running Data Retention Policy check...');

    const sixYearsAgo = new Date();
    sixYearsAgo.setFullYear(sixYearsAgo.getFullYear() - 6);

    // HMRC compliance: keep financial records (Payouts) for 6 years, then we can archive or delete.
    // Example: Delete old un-needed Support Tickets older than 3 years to save space (GDPR).
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

    const deletedTickets = await this.prisma.supportTicket.deleteMany({
      where: {
        createdAt: { lt: threeYearsAgo }
      }
    });

    this.logger.log(`Purged ${deletedTickets.count} old support tickets for GDPR compliance.`);
  }
}
