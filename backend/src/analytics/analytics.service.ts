import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getSalesAnalytics() {
    const totalOrders = await this.prisma.booking.count();
    const cancelledOrders = await this.prisma.booking.count({ where: { status: 'CANCELLED' } });
    const deliveredOrders = await this.prisma.booking.count({ where: { status: 'COMPLETED' } });

    const aggregations = await this.prisma.booking.aggregate({
      _sum: { totalAmount: true },
      _avg: { totalAmount: true }
    });

    // Mock peak hour heatmap data for UI (as accurate DB grouping by hour depends on DB dialect)
    const peakHours = [
      { hour: '11:00 AM', volume: 45 },
      { hour: '12:00 PM', volume: 120 },
      { hour: '01:00 PM', volume: 85 },
      { hour: '02:00 PM', volume: 30 }
    ];

    return {
      totalRevenue: aggregations._sum?.totalAmount || 0,
      averageOrderValue: aggregations._avg?.totalAmount || 0,
      totalOrders,
      cancelledOrders,
      deliveredOrders,
      peakHours
    };
  }

  async getCustomerAnalytics() {
    const totalCustomers = await this.prisma.user.count({ where: { role: 'CUSTOMER' } });
    
    // Customers with > 1 order
    const repeatCustomersData = await this.prisma.booking.groupBy({
      by: ['userId'],
      _count: { id: true },
      having: {
        id: { _count: { gt: 1 } }
      }
    });

    const repeatCustomers = repeatCustomersData.length;
    const repeatRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;

    return {
      totalCustomers,
      repeatCustomers,
      repeatRate: repeatRate.toFixed(1),
      acquisitionRate: '+12% this month', // Mock trend
      churnRate: '4.5%', // Mock trend
    };
  }

  async getRiderAnalytics() {
    const totalRiders = await this.prisma.user.count({ where: { role: 'RIDER' } });
    
    return {
      totalRiders,
      activeRiders: Math.floor(totalRiders * 0.8), // Mock active status
      averageDeliveryTime: '24 mins',
      onTimeRate: '92%',
      zoneCoverageGaps: ['Zone North', 'Zone East']
    };
  }

  async generateExport(dataset: string): Promise<string> {
    if (dataset === 'sales') {
      const orders = await this.prisma.booking.findMany({
        select: { id: true, totalAmount: true, status: true, deliveryDate: true, shopId: true },
        orderBy: { deliveryDate: 'desc' }
      });
      let csv = 'OrderID,Amount,Status,Date,ShopID\n';
      orders.forEach(o => {
        csv += `${o.id},${o.totalAmount},${o.status},${o.deliveryDate},${o.shopId}\n`;
      });
      return csv;
    }
    
    if (dataset === 'customers') {
      const users = await this.prisma.user.findMany({
        where: { role: 'CUSTOMER' },
        select: { id: true, firstName: true, lastName: true, email: true, createdAt: true }
      });
      let csv = 'CustomerID,Name,Email,JoinDate\n';
      users.forEach(u => {
        csv += `${u.id},${u.firstName} ${u.lastName},${u.email},${u.createdAt}\n`;
      });
      return csv;
    }

    return 'No data available\n';
  }

  async getBiExport() {
    const orders = await this.prisma.booking.findMany({
      select: {
        id: true,
        status: true,
        totalAmount: true,
        createdAt: true,
        deliveryDate: true,
        shop: { select: { name: true, deliveryArea: true } },
        user: { select: { segment: true, ltv: true } }
      }
    });

    return {
      metadata: { generatedAt: new Date().toISOString(), totalRecords: orders.length },
      data: orders
    };
  }
}
