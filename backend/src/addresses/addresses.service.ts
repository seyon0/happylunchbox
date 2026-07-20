import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, data: any) {
    // If setting as default or if it's the first one, handle defaults
    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    } else {
      const existing = await this.prisma.address.count({ where: { userId } });
      if (existing === 0) data.isDefault = true;
    }

    return this.prisma.address.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
      },
    });
  }

  async setAsDefault(userId: string, addressId: string) {
    await this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    return this.prisma.address.update({
      where: { id: addressId, userId },
      data: { isDefault: true },
    });
  }

  async remove(userId: string, id: string) {
    // Check ownership
    const address = await this.prisma.address.findFirst({ where: { id, userId } });
    if (!address) throw new NotFoundException('Address not found');

    await this.prisma.address.delete({ where: { id } });

    // If we deleted the default, set newest to default
    if (address.isDefault) {
      const newest = await this.prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      if (newest) {
        await this.prisma.address.update({
          where: { id: newest.id },
          data: { isDefault: true },
        });
      }
    }

    return { success: true };
  }
}
