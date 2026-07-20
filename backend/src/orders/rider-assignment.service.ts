import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class RiderAssignmentService {
  private readonly logger = new Logger(RiderAssignmentService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleAutoAssignment() {
    this.logger.debug('Running Rider Auto-Assignment Job...');
    
    // Find unassigned orders that are cooking or confirmed
    const unassignedOrders = await this.prisma.booking.findMany({
      where: {
        riderId: null,
        status: {
          in: ['ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP'] as Status[]
        }
      },
      include: {
        shop: true
      }
    });

    if (unassignedOrders.length === 0) return;

    // Fetch all active riders
    const activeRiders = await this.prisma.user.findMany({
      where: {
        role: 'RIDER',
        isBanned: false,
        isVerified: true
      }
    });

    if (activeRiders.length === 0) {
      this.logger.warn('No active riders available for assignment');
      return;
    }

    // Basic round-robin or random assignment for MVP tuning
    for (const order of unassignedOrders) {
      // Pick a random rider for now
      const assignedRider = activeRiders[Math.floor(Math.random() * activeRiders.length)];
      
      await this.prisma.booking.update({
        where: { id: order.id },
        data: { riderId: assignedRider.id }
      });

      this.logger.log(`Assigned Order ${order.id} to Rider ${assignedRider.id}`);
    }
  }
}
