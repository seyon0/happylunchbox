import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MarketingService {
  constructor(private prisma: PrismaService) {}

  async getCoupons() {
    return this.prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async createCoupon(data: any) {
    return this.prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        type: data.type,
        value: parseFloat(data.value),
        scope: data.scope,
        targetId: data.targetId || null,
        usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        isActive: data.isActive !== undefined ? data.isActive : true,
      }
    });
  }

  async toggleCoupon(id: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new Error('Coupon not found');
    return this.prisma.coupon.update({
      where: { id },
      data: { isActive: !coupon.isActive }
    });
  }

  async deleteCoupon(id: string) {
    return this.prisma.coupon.delete({ where: { id } });
  }

  async getBoostedListings() {
    return this.prisma.boostedListing.findMany({
      include: {
        shop: { select: { name: true } }
      },
      orderBy: { startDate: 'desc' }
    });
  }

  async createBoostedListing(data: any) {
    return this.prisma.boostedListing.create({
      data: {
        shopId: data.shopId,
        slot: parseInt(data.slot),
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: data.isActive !== undefined ? data.isActive : true,
      }
    });
  }

  async deleteBoostedListing(id: string) {
    return this.prisma.boostedListing.delete({ where: { id } });
  }

  async getCmsPages() {
    // Seed default pages if none exist
    const count = await this.prisma.cmsPage.count();
    if (count === 0) {
      await this.prisma.cmsPage.createMany({
        data: [
          { slug: 'about-us', title: 'About Us', content: '<h2>Welcome to Healthy Lunchbox</h2><p>We deliver fresh...</p>' },
          { slug: 'privacy-policy', title: 'Privacy Policy', content: '<h2>GDPR Compliant Privacy Policy</h2><p>Your data...</p>' },
          { slug: 'terms', title: 'Terms & Conditions', content: '<h2>Terms of Service</h2><p>By using this app...</p>' },
          { slug: 'faq', title: 'FAQ', content: '<h2>Frequently Asked Questions</h2><p>How does delivery work?</p>' }
        ]
      });
    }
    return this.prisma.cmsPage.findMany({ orderBy: { slug: 'asc' } });
  }

  async updateCmsPage(slug: string, data: any) {
    return this.prisma.cmsPage.update({
      where: { slug },
      data: {
        title: data.title,
        content: data.content,
        lastUpdatedBy: data.lastUpdatedBy
      }
    });
  }

  async getTemplates() {
    // Seed default templates if none exist
    const count = await this.prisma.messageTemplate.count();
    if (count === 0) {
      await this.prisma.messageTemplate.createMany({
        data: [
          { slug: 'orderConfirmation', channel: 'EMAIL', subject: 'Your Order {{orderId}} is Confirmed', body: 'Hi {{name}}, your order from {{restaurant}} is being prepared.' },
          { slug: 'promoBlast', channel: 'EMAIL', subject: 'Special Offer Just For You!', body: 'Use code {{promoCode}} for {{discount}} off your next order.' },
          { slug: 'passwordReset', channel: 'EMAIL', subject: 'Reset Your Password', body: 'Click here to reset your password: {{link}}' },
          { slug: 'riderAssigned', channel: 'SMS', subject: null, body: 'Your rider {{riderName}} is on the way with your lunchbox!' }
        ]
      });
    }
    return this.prisma.messageTemplate.findMany({ orderBy: { slug: 'asc' } });
  }

  async updateTemplate(slug: string, data: any) {
    return this.prisma.messageTemplate.update({
      where: { slug },
      data: {
        subject: data.subject,
        body: data.body
      }
    });
  }
}
