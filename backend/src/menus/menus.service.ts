import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenusService {
  constructor(private prisma: PrismaService) {}

  // ---- CATEGORIES ----
  findAllCategories(shopId: string) {
    return this.prisma.menuCategory.findMany({
      where: { shopId },
      orderBy: { order: 'asc' },
      include: {
        menuItems: {
          include: {
            variants: true,
            addOnGroups: {
              include: { items: true }
            }
          }
        }
      }
    });
  }

  createCategory(shopId: string, data: any) {
    return this.prisma.menuCategory.create({
      data: {
        ...data,
        shop: { connect: { id: shopId } }
      }
    });
  }

  updateCategory(id: string, data: any) {
    return this.prisma.menuCategory.update({
      where: { id },
      data
    });
  }

  deleteCategory(id: string) {
    return this.prisma.menuCategory.delete({
      where: { id }
    });
  }

  async reorderCategories(shopId: string, categoryIds: string[]) {
    // categoryIds is an ordered array
    const updates = categoryIds.map((id, index) => {
      return this.prisma.menuCategory.update({
        where: { id },
        data: { order: index }
      });
    });
    return this.prisma.$transaction(updates);
  }

  // ---- ITEMS ----
  findAllByShop(shopId: string) {
    return this.prisma.menuItem.findMany({
      where: { shopId },
      include: {
        variants: true,
        addOnGroups: {
          include: { items: true }
        }
      }
    });
  }

  create(shopId: string, data: any) {
    const { categoryId, variants, addOnGroups, shopId: _shopId, ...rest } = data;
    return this.prisma.menuItem.create({
      data: {
        ...rest,
        shop: { connect: { id: shopId } },
        category: { connect: { id: categoryId } },
        variants: {
          create: variants || []
        },
        addOnGroups: {
          create: (addOnGroups || []).map((group: any) => ({
            name: group.name,
            isRequired: group.isRequired,
            minSelect: group.minSelect,
            maxSelect: group.maxSelect,
            items: {
              create: group.items || []
            }
          }))
        }
      },
      include: {
        variants: true,
        addOnGroups: { include: { items: true } }
      }
    });
  }

  async update(id: string, data: any) {
    const { categoryId, variants, addOnGroups, shopId: _shopId, ...rest } = data;
    
    if (variants || addOnGroups) {
      await this.prisma.$transaction([
        ...(variants ? [this.prisma.itemVariant.deleteMany({ where: { menuItemId: id } })] : []),
        ...(addOnGroups ? [this.prisma.addOnGroup.deleteMany({ where: { menuItemId: id } })] : [])
      ]);
    }

    return this.prisma.menuItem.update({
      where: { id },
      data: {
        ...rest,
        ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
        ...(variants ? { variants: { create: variants } } : {}),
        ...(addOnGroups ? {
          addOnGroups: {
            create: addOnGroups.map((group: any) => ({
              name: group.name,
              isRequired: group.isRequired,
              minSelect: group.minSelect,
              maxSelect: group.maxSelect,
              items: {
                create: group.items || []
              }
            }))
          }
        } : {})
      },
      include: {
        variants: true,
        addOnGroups: { include: { items: true } }
      }
    });
  }

  updatePromo(id: string, data: any) {
    const { promoCode, promoDiscountPercent, promoExpiry, promoEnabled } = data;
    return this.prisma.menuItem.update({
      where: { id },
      data: {
        promoCode,
        promoDiscountPercent: promoDiscountPercent ? parseFloat(promoDiscountPercent) : null,
        promoExpiry: promoExpiry ? new Date(promoExpiry) : null,
        promoEnabled: !!promoEnabled
      }
    });
  }

  remove(id: string) {
    return this.prisma.menuItem.delete({
      where: { id }
    });
  }

  // ---- STOCK TOGGLE ----
  toggleStock(type: 'ITEM' | 'VARIANT' | 'ADDON', id: string, isAvailable: boolean, autoReEnableAt?: string | Date | null) {
    const reEnableDate = autoReEnableAt ? new Date(autoReEnableAt) : null;
    if (type === 'ITEM') {
      return this.prisma.menuItem.update({
        where: { id },
        data: { isAvailable, autoReEnableAt: reEnableDate }
      });
    } else if (type === 'VARIANT') {
      return this.prisma.itemVariant.update({
        where: { id },
        data: { isAvailable, autoReEnableAt: reEnableDate }
      });
    } else if (type === 'ADDON') {
      return this.prisma.addOnItem.update({
        where: { id },
        data: { isAvailable, autoReEnableAt: reEnableDate }
      });
    }
    throw new Error('Invalid toggle type');
  }
}
