import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { REQUIRE_PERMISSION_KEY, PermissionRequirement } from './rbac.decorator';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<PermissionRequirement>(
      REQUIRE_PERMISSION_KEY,
      context.getHandler(),
    );

    if (!requiredPermission) {
      return true; // No specific RBAC requirement for this endpoint
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Set by JwtAuthGuard

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (user.role === 'SUPER_ADMIN') {
      return true; // SuperAdmins bypass all RBAC checks
    }

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Only Admin/SubAdmin users can access this resource');
    }

    // Check relational permissions for the SubAdmin
    const subAdmin = await this.prisma.subAdminRole.findUnique({
      where: { userId: user.id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!subAdmin) {
      throw new ForbiddenException('SubAdmin profile not found');
    }

    const hasPermission = subAdmin.permissions.some(
      (rp) => 
        rp.permission.module === requiredPermission.module && 
        rp.permission.action === requiredPermission.action
    );

    if (!hasPermission) {
      throw new ForbiddenException(`Missing required permission: ${requiredPermission.action} on module ${requiredPermission.module}`);
    }

    return true;
  }
}
