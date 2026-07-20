import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ShopRole } from '@prisma/client';
import { SHOP_ROLES_KEY } from './shop-roles.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ShopRolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ShopRole[]>(SHOP_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true; // No specific shop role required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // We assume shopId is a route param: /api/shops/:shopId/...
    const shopId = request.params.shopId || request.params.id; 

    if (!user || !user.userId || !shopId) {
      throw new ForbiddenException('Invalid user or shop context');
    }

    const shopStaff = await this.prisma.shopStaff.findUnique({
      where: {
        shopId_userId: {
          shopId,
          userId: user.userId,
        },
      },
    });

    if (!shopStaff) {
      throw new ForbiddenException('You do not have access to this shop');
    }

    const hasRole = requiredRoles.includes(shopStaff.role);
    if (!hasRole) {
      throw new ForbiddenException(`Access denied. Requires one of: ${requiredRoles.join(', ')}`);
    }

    // Attach role to request for downstream use if needed
    request.shopRole = shopStaff.role;
    return true;
  }
}
