import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlertsService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedAlerts();
  }

  async seedAlerts() {
    const existing = await this.prisma.adminAlert.count();
    if (existing > 0) return; // Already seeded

    const alerts = [
      { type: 'NEW_APPLICATION', message: 'New Vendor Application: The Salad Bowl (London). Pending review.', severity: 'INFO' },
      { type: 'NEW_APPLICATION', message: 'New Rider Application: David Smith. Documents uploaded.', severity: 'INFO' },
      { type: 'FRAUD_SIGNAL', message: 'Unusual Order Pattern Detected: 5 large orders from identical IP (10.0.0.54).', severity: 'WARNING' },
      { type: 'GATEWAY_FAILURE', message: 'Stripe Webhook Failure: 3 consecutive timeouts detected on payment_intent.succeeded.', severity: 'CRITICAL' },
      { type: 'ESCALATION', message: 'Escalated Complaint: Ticket #TK-009 has breached the 24hr SLA.', severity: 'WARNING' },
      { type: 'SYSTEM_DOWNTIME', message: 'Database replication lag exceeded 500ms.', severity: 'CRITICAL' }
    ];

    for (const a of alerts) {
      await this.prisma.adminAlert.create({
        data: {
          type: a.type,
          message: a.message,
          severity: a.severity
        }
      });
    }
  }

  async getAlerts() {
    return this.prisma.adminAlert.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  }

  async markAsRead(id: string) {
    return this.prisma.adminAlert.update({
      where: { id },
      data: { isRead: true }
    });
  }
}
