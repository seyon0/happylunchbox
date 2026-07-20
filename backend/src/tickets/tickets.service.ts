import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, data: any) {
    const ticketCount = await this.prisma.supportTicket.count();
    const ticketId = `TK-${String(ticketCount + 1).padStart(3, '0')}`;

    const initialMessage = {
      from: 'customer',
      text: data.message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    return this.prisma.supportTicket.create({
      data: {
        id: ticketId,
        subject: data.subject,
        status: 'OPEN',
        user: { connect: { id: userId } },
        messages: [initialMessage],
      },
    });
  }
}
