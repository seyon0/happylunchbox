import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedDefaults();
  }

  async seedDefaults() {
    const defaults = [
      { key: 'platformName', value: 'Healthy Lunchbox', category: 'GENERAL' },
      { key: 'contactEmail', value: 'support@healthylunchbox.co.uk', category: 'GENERAL' },
      { key: 'businessHours', value: '09:00 - 17:00', category: 'GENERAL' },
      { key: 'maintenanceMode', value: false, category: 'GENERAL' },
      { key: 'region', value: 'UK', category: 'GENERAL' },
      { key: 'currency', value: 'GBP', category: 'GENERAL' },
      
      { key: 'smtpConfig', value: { host: 'smtp.sendgrid.net', port: 587, user: 'apikey', pass: '' }, category: 'INTEGRATIONS' },
      { key: 'smsGateway', value: { provider: 'Twilio', accountSid: '', authToken: '' }, category: 'INTEGRATIONS' },
      { key: 'paymentKeys', value: { provider: 'Stripe', mode: 'sandbox', publicKey: '', secretKey: '' }, category: 'INTEGRATIONS' },
      { key: 'mapsApi', value: { provider: 'GoogleMaps', apiKey: '' }, category: 'INTEGRATIONS' },
      
      { key: 'seoMeta', value: { title: 'Healthy Lunchbox - Fresh Daily Deliveries', description: 'Order healthy lunchboxes.' }, category: 'SEO' },
      { key: 'legalDocsVersion', value: { privacyPolicy: 'v1.0', terms: 'v1.0' }, category: 'SEO' }
    ];

    for (const def of defaults) {
      const exists = await this.prisma.systemSetting.findUnique({ where: { key: def.key } });
      if (!exists) {
        await this.prisma.systemSetting.create({
          data: {
            key: def.key,
            value: def.value as any,
            category: def.category
          }
        });
      }
    }

    const integrations = ['ZENDESK', 'MAILCHIMP', 'SENDGRID'];
    for (const name of integrations) {
      const exists = await this.prisma.integrationConfig.findUnique({ where: { name } });
      if (!exists) {
        await this.prisma.integrationConfig.create({
          data: { name, isActive: false }
        });
      }
    }
  }

  async getAllSettings() {
    const settingsList = await this.prisma.systemSetting.findMany();
    const grouped: Record<string, any> = {};
    for (const s of settingsList) {
      if (!grouped[s.category]) grouped[s.category] = {};
      grouped[s.category][s.key] = s.value;
    }
    return grouped;
  }

  async updateSetting(key: string, value: any) {
    return this.prisma.systemSetting.update({
      where: { key },
      data: { value }
    });
  }

  async generateBackup() {
    // Collect crucial db tables for backup export
    return {
      settings: await this.prisma.systemSetting.findMany(),
      users: await this.prisma.user.findMany({ select: { id: true, email: true, role: true } }),
      shops: await this.prisma.shop.findMany({ select: { id: true, name: true } }),
      timestamp: new Date().toISOString()
    };
  }

  async getIntegrations() {
    return this.prisma.integrationConfig.findMany();
  }

  async updateIntegration(name: string, data: any) {
    return this.prisma.integrationConfig.upsert({
      where: { name },
      update: data,
      create: { name, ...data }
    });
  }
}
