import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { TicketStatus } from '@prisma/client';

@Injectable()
export class SupportService {
  private readonly logger = new Logger(SupportService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async escalateOverdueTickets() {
    this.logger.log('Running escalation cron job...');
    const overdueTickets = await this.prisma.supportTicket.findMany({
      where: {
        status: { in: ['OPEN', 'IN_PROGRESS'] },
        isEscalated: false,
        slaDeadline: { lt: new Date() }
      }
    });

    if (overdueTickets.length > 0) {
      await this.prisma.supportTicket.updateMany({
        where: { id: { in: overdueTickets.map(t => t.id) } },
        data: { isEscalated: true, priority: 'HIGH' }
      });
      this.logger.log(`Escalated ${overdueTickets.length} tickets.`);
    }
  }

  async getReviews() {
    return this.prisma.review.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async hideReview(id: string, reason: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new Error('Review not found');

    return this.prisma.review.update({
      where: { id },
      data: { isHidden: true, hiddenReason: reason }
    });
  }

  async getTickets() {
    return this.prisma.supportTicket.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateTicketStatus(id: string, status: string) {
    return this.prisma.supportTicket.update({
      where: { id },
      data: { status: status as TicketStatus }
    });
  }

  async assignTicket(id: string, assignedTo: string) {
    return this.prisma.supportTicket.update({
      where: { id },
      data: { assignedTo }
    });
  }

  async createTicket(userId: string, subject: string, message: string) {
    const slaDeadline = new Date();
    slaDeadline.setHours(slaDeadline.getHours() + 24); // 24-hour SLA

    return this.prisma.supportTicket.create({
      data: {
        userId,
        subject,
        messages: [{ from: 'customer', text: message, time: new Date().toISOString() }],
        status: 'OPEN',
        slaDeadline
      }
    });
  }

  async replyTicket(id: string, from: string, text: string) {
    const ticket = await this.prisma.supportTicket.findUnique({ where: { id } });
    if (!ticket) throw new Error('Ticket not found');
    
    const messages = Array.isArray(ticket.messages) ? ticket.messages : [];
    messages.push({ from, text, time: new Date().toISOString() });

    return this.prisma.supportTicket.update({
      where: { id },
      data: { messages }
    });
  }

  async getMyTickets(userId: string) {
    return this.prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getTrends() {
    const reviews = await this.prisma.review.findMany({ where: { isHidden: false } });
    
    let shopSum = 0, shopCount = 0;
    let riderSum = 0, riderCount = 0;

    for (const r of reviews) {
      if (r.targetType === 'SHOP') { shopSum += r.rating; shopCount++; }
      if (r.targetType === 'RIDER') { riderSum += r.rating; riderCount++; }
    }

    const platformAvg = (shopSum + riderSum) / ((shopCount + riderCount) || 1);
    const shopAvg = shopSum / (shopCount || 1);
    const riderAvg = riderSum / (riderCount || 1);

    return {
      platformAvg: platformAvg.toFixed(1),
      shopAvg: shopAvg.toFixed(1),
      riderAvg: riderAvg.toFixed(1),
      totalReviews: shopCount + riderCount
    };
  }
}
