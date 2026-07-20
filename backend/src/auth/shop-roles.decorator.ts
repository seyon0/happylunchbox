import { SetMetadata } from '@nestjs/common';
import { ShopRole } from '@prisma/client';

export const SHOP_ROLES_KEY = 'shopRoles';
export const ShopRoles = (...roles: ShopRole[]) => SetMetadata(SHOP_ROLES_KEY, roles);
