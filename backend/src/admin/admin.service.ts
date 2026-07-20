import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardMetrics() {
    const [totalUsers, totalShops, totalBookings, totalRevenue] = await Promise.all([
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
      this.prisma.shop.count(),
      this.prisma.booking.count(),
      this.prisma.booking.aggregate({ _sum: { totalAmount: true } }),
    ]);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayRevenue = await this.prisma.booking.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: todayStart } },
    });
    const predictiveInsights = {
      forecastRevenueNextWeek: (totalRevenue._sum.totalAmount ?? 0) * 1.15,
      trendingDishes: ['Spicy Basil Chicken', 'Tofu Salad'],
      demandSpikeExpected: 'Thursday'
    };

    return {
      totalUsers,
      totalShops,
      totalBookings,
      totalRevenue: totalRevenue._sum.totalAmount ?? 0,
      todayRevenue: todayRevenue._sum.totalAmount ?? 0,
      predictiveInsights
    };
  }

  async getAuditLogs(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { actor: { select: { firstName: true, lastName: true, email: true } } },
      }),
      this.prisma.auditLog.count(),
    ]);
    return { data, total, page, limit };
  }

  async createAuditLog(
    actorId: string,
    action: string,
    targetType: string,
    targetId: string,
    detail?: string,
    ipAddress?: string,
  ) {
    return this.prisma.auditLog.create({
      data: { actorId, action, targetType, targetId, detail, ipAddress, module: 'UNKNOWN' },
    });
  }

  async getVendorOnboardingQueue() {
    return this.prisma.shop.findMany({
      where: { onboardingStatus: { in: ['PENDING', 'UNDER_REVIEW'] } },
      include: {
        staff: { include: { user: { select: { firstName: true, lastName: true, email: true, phone: true } } } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateVendorStatus(shopId: string, status: string, actorId: string) {
    const shop = await this.prisma.shop.update({
      where: { id: shopId },
      data: { onboardingStatus: status as any },
    });
    await this.createAuditLog(actorId, `VENDOR_STATUS_${status}`, 'Shop', shopId);
    return shop;
  }

  async updateIpAllowlist(targetUserId: string, ips: string) {
    return this.prisma.user.update({
      where: { id: targetUserId },
      data: { ipAllowList: ips },
    });
  }

  async getSystemConfig() {
    return this.prisma.systemConfig.findMany({ orderBy: { group: 'asc' } });
  }

  async updateSystemConfig(key: string, value: string, actorId: string) {
    const config = await this.prisma.systemConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    await this.createAuditLog(
      actorId,
      'UPDATE_SYSTEM_CONFIG',
      'SystemConfig',
      key,
      `value=${value}`,
    );
    return config;
  }

  async getCommissionTiers() {
    return this.prisma.commissionTier.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async createCommissionTier(data: any) {
    return this.prisma.commissionTier.create({ data });
  }

  async getAllShops(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.shop.findMany({
        skip,
        take: limit,
        include: {
          staff: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
          commissionTier: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.shop.count(),
    ]);
    return { data, total, page, limit };
  }

  async getAllCustomers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { role: 'CUSTOMER' },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          walletBalance: true,
          ltv: true,
          segment: true,
          isBanned: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
    ]);
    return { data, total, page, limit };
  }

  async banCustomer(userId: string, actorId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { isBanned: true },
    });
    await this.createAuditLog(actorId, 'BAN_CUSTOMER', 'User', userId);
    return user;
  }

  async unbanCustomer(userId: string, actorId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { isBanned: false },
    });
    await this.createAuditLog(actorId, 'UNBAN_CUSTOMER', 'User', userId);
    return user;
  }

  async getAllOrders(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.booking.findMany({
        skip,
        take: limit,
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          shop: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.booking.count(),
    ]);
    return { data, total, page, limit };
  }

  async forceCancelOrder(bookingId: string, actorId: string) {
    const booking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED', refundStatus: 'PENDING_REFUND' },
    });
    await this.createAuditLog(actorId, 'FORCE_CANCEL_ORDER', 'Booking', bookingId);
    return booking;
  }

  async getAllRiders(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { role: 'RIDER' },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count({ where: { role: 'RIDER' } }),
    ]);
    return { data, total, page, limit };
  }

  async toggleRiderAvailability(riderId: string, actorId: string) {
    const rider = await this.prisma.user.findUnique({ where: { id: riderId, role: 'RIDER' } });
    if (!rider) throw new Error('Rider not found');
    
    const updated = await this.prisma.user.update({
      where: { id: riderId },
      data: { isBanned: !rider.isBanned }, // using isBanned as an active/inactive flag for now, or if they have an active flag
    });
    
    await this.createAuditLog(actorId, 'TOGGLE_RIDER_AVAILABILITY', 'User', riderId);
    return updated;
  }

  async getSupportTickets(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.supportTicket.findMany({
        skip,
        take: limit,
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.supportTicket.count(),
    ]);
    return { data, total, page, limit };
  }

  async updateTicket(ticketId: string, data: any, actorId?: string) {
    return this.prisma.supportTicket.update({ where: { id: ticketId }, data });
  }

  async getPayouts(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.payout.findMany({
        skip,
        take: limit,
        include: { shop: { select: { name: true } } },
        orderBy: { triggeredAt: 'desc' },
      }),
      this.prisma.payout.count(),
    ]);
    return { data, total, page, limit };
  }

  // --- SUB-ADMINS & ROLES ---
  async getSubAdmins() {
    return this.prisma.subAdminRole.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, email: true, isBanned: true } },
        permissions: { include: { permission: true } }
      }
    });
  }

  async createSubAdmin(data: any) {
    const { userId, name, permissionIds } = data;
    // 1. Ensure user is ADMIN role
    await this.prisma.user.update({ where: { id: userId }, data: { role: 'ADMIN' } });
    
    // 2. Create subAdminRole
    const subAdmin = await this.prisma.subAdminRole.create({
      data: {
        userId,
        name,
        permissions: {
          create: permissionIds.map((pid: string) => ({
            permission: { connect: { id: pid } }
          }))
        }
      }
    });
    return subAdmin;
  }

  async updateSubAdmin(id: string, data: any) {
    const { name, permissionIds } = data;
    // Clear old permissions and set new
    if (permissionIds) {
      await this.prisma.rolePermission.deleteMany({ where: { subAdminRoleId: id } });
      await this.prisma.subAdminRole.update({
        where: { id },
        data: {
          name,
          permissions: {
            create: permissionIds.map((pid: string) => ({
              permission: { connect: { id: pid } }
            }))
          }
        }
      });
    } else if (name) {
      await this.prisma.subAdminRole.update({ where: { id }, data: { name } });
    }
    return this.getSubAdmins();
  }

  async getPermissions() {
    return this.prisma.permission.findMany();
  }

  // --- PROMOTIONS ---
  async getPromotions() {
    return this.prisma.promotionBanner.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async createPromotion(data: any) {
    return this.prisma.promotionBanner.create({ data });
  }

  async updatePromotion(id: string, data: any) {
    return this.prisma.promotionBanner.update({ where: { id }, data });
  }

  async deletePromotion(id: string) {
    return this.prisma.promotionBanner.delete({ where: { id } });
  }
}
