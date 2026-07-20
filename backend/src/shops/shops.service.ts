import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ShopsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.shop.findMany();
  }

  findOne(id: string) {
    return this.prisma.shop.findUnique({
      where: { id },
      include: { menuItems: true, staff: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } } } }
    });
  }

  async create(data: any, ownerId: string) {
    const { ownerId: _, ...shopData } = data; // ownerId was passed in payload possibly, discard it
    
    // Create shop and assign owner role in one transaction
    return this.prisma.shop.create({
      data: {
        ...shopData,
        staff: {
          create: {
            userId: ownerId,
            role: 'OWNER'
          }
        }
      }
    });
  }

  update(id: string, data: any) {
    return this.prisma.shop.update({
      where: { id },
      data
    });
  }

  async updateOperations(shopId: string, data: any) {
    // Only allow specific fields
    const { isOperating, upiId, bookingCutoffHours, cancellationLeadHours, seoTags } = data;
    
    // Create update payload dropping undefined fields
    const updateData: any = {
      isOperating, upiId, bookingCutoffHours, cancellationLeadHours, seoTags
    };
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    return this.prisma.shop.update({
      where: { id: shopId },
      data: updateData
    });
  }

  async getPerformance(shopId: string, range?: string) {
    const shop = await this.prisma.shop.findUnique({ 
      where: { id: shopId },
      include: { menuItems: true }
    });
    if (!shop) throw new NotFoundException('Shop not found');
    
    let dateFilter = {};
    const now = new Date();
    
    if (range === 'today') {
      const startOfDay = new Date(now.setHours(0,0,0,0));
      dateFilter = { gte: startOfDay };
    } else if (range === 'thisWeek') {
      // Rolling 7 days
      const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { gte: startOfWeek };
    } else if (range === 'last12Weeks') {
      const startOf12Weeks = new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000);
      dateFilter = { gte: startOf12Weeks };
    }

    const bookings = await this.prisma.booking.findMany({
      where: { 
        shopId,
        ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {})
      },
      select: { id: true, status: true, totalAmount: true, createdAt: true }
    });

    const totalOrders = bookings.length;
    const completedOrders = bookings.filter(b => b.status === 'COMPLETED').length;
    const cancelledOrders = bookings.filter(b => b.status === 'CANCELLED').length;
    const totalRevenue = bookings.filter(b => ['COMPLETED', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'HANDED_TO_RIDER'].includes(b.status)).reduce((sum, b) => sum + b.totalAmount, 0);
    
    const unavailableItemsCount = shop.menuItems.filter(item => !item.isAvailable).length;

    return {
      totalOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
      rating: shop.rating,
      reviewCount: shop.reviewCount,
      unavailableItemsCount,
      isOperating: shop.isOperating
    };
  }

  // Staff Management
  async addStaff(shopId: string, email: string, role: 'MANAGER' | 'STAFF') {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found. They must register as a customer first.');

    // Upsert to handle re-adding or updating role
    return this.prisma.shopStaff.upsert({
      where: { shopId_userId: { shopId, userId: user.id } },
      update: { role },
      create: { shopId, userId: user.id, role },
    });
  }

  async removeStaff(shopId: string, userId: string) {
    return this.prisma.shopStaff.delete({
      where: { shopId_userId: { shopId, userId } }
    });
  }
}
