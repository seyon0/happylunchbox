import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);

  const coupons = [
    { code: 'JAFFNA10', type: 'PERCENTAGE', value: 10 },
    { code: 'WELCOME5', type: 'FLAT', value: 5.00 },
    { code: 'SUMMER20', type: 'PERCENTAGE', value: 20 },
    { code: 'FREESHIP', type: 'FLAT', value: 2.50 },
  ];

  console.log('Seeding coupons...');
  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {},
      create: {
        code: c.code,
        type: c.type,
        value: c.value,
        scope: 'GLOBAL',
        isActive: true,
      },
    });
    console.log(`Upserted coupon ${c.code}`);
  }

  await app.close();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

