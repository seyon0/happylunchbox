import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Status } from '@prisma/client';
import { OrdersGateway } from './orders.gateway';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private ordersGateway: OrdersGateway,
  ) {}

  findAllByUser(userId: string, skip: number = 0, take: number = 50) {
    return this.prisma.booking.findMany({
      where: { userId },
      skip,
      take,
      include: { shop: { select: { name: true } }, items: true }
    });
  }

  findAllByShop(shopId: string, skip: number = 0, take: number = 50) {
    return this.prisma.booking.findMany({
      where: { shopId },
      skip,
      take,
      include: { user: { select: { firstName: true, lastName: true, phone: true } }, items: true }
    });
  }

  findActiveQueue(shopId: string) {
    return this.prisma.booking.findMany({
      where: { 
        shopId,
        status: { in: ['ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP'] }
      },
      orderBy: { createdAt: 'asc' },
      include: { user: { select: { firstName: true, lastName: true, phone: true } }, items: true }
    });
  }

  findRiderDeliveries(riderId: string) {
    return this.prisma.booking.findMany({
      where: {
        riderId,
        status: { in: ['ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'HANDED_TO_RIDER', 'COMPLETED'] }
      },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { firstName: true, lastName: true, phone: true } },
        shop: { select: { name: true, id: true } },
        items: true
      }
    });
  }

  async create(userId: string, data: any) {
    // Generate a mock risk score (0-100), higher means higher risk of fraud
    const riskScore = Math.floor(Math.random() * 100);
    
    const { items, shopId, ...restData } = data;

    const booking = await this.prisma.booking.create({
      data: {
        ...restData,
        riskScore,
        user: { connect: { id: userId } },
        shop: { connect: { id: shopId } },
        ...(items && items.length > 0 ? {
          items: {
            create: items.map((item: any) => ({
              menuItemId: item.menuItemId,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              addOns: item.addOns
            }))
          }
        } : {})
      },
      include: { items: true, user: { select: { firstName: true, lastName: true, phone: true } } }
    });

    this.ordersGateway.emitOrderCreated(shopId, booking);
    return booking;
  }

  async updateStatus(id: string, status: Status) {
    const booking = await this.prisma.booking.update({
      where: { id },
      data: { status },
      include: { items: true, user: { select: { firstName: true, lastName: true, phone: true } } }
    });

    this.ordersGateway.emitOrderUpdated(booking.shopId, booking);
    return booking;
  }

  async getRiderIncentives(riderId: string) {
    const today = new Date();
    today.setHours(0,0,0,0);
    const deliveriesToday = await this.prisma.booking.count({
      where: { 
        riderId, 
        status: 'COMPLETED',
        updatedAt: { gte: today }
      }
    });

    return {
      dailyTarget: 10,
      currentProgress: deliveriesToday,
      bonusAmount: 20,
      message: 'Deliver 10 orders today to earn a £20 bonus!'
    };
  }
}
