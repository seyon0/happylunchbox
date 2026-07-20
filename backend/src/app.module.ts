import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ShopsModule } from './shops/shops.module';
import { MenusModule } from './menus/menus.module';
import { OrdersModule } from './orders/orders.module';
import { WalletModule } from './wallet/wallet.module';
import { AdminModule } from './admin/admin.module';
import { StripeModule } from './stripe/stripe.module';
import { FinanceModule } from './finance/finance.module';
import { MarketingModule } from './marketing/marketing.module';
import { SupportModule } from './support/support.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SettingsModule } from './settings/settings.module';
import { AlertsModule } from './alerts/alerts.module';
import { EncryptionService } from './common/encryption.service';
import { DataRetentionService } from './common/data-retention.service';
import { AddressesModule } from './addresses/addresses.module';
import { TicketsModule } from './tickets/tickets.module';
import { CouponsModule } from './coupons/coupons.module';

import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    UsersModule,
    AuthModule,
    ShopsModule,
    MenusModule,
    OrdersModule,
    WalletModule,
    AdminModule,
    StripeModule,
    FinanceModule,
    MarketingModule,
    SupportModule,
    AnalyticsModule,
    SettingsModule,
    AlertsModule,
    AddressesModule,
    TicketsModule,
    CouponsModule,
  ],
  controllers: [AppController],
  providers: [AppService, EncryptionService, DataRetentionService],
})
export class AppModule {}
