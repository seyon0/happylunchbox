import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';
import { Reflector } from '@nestjs/core';

export const AUDIT_MODULE_KEY = 'audit_module';
export const Audit = (module: string) => Reflect.metadata(AUDIT_MODULE_KEY, module);

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService, private reflector: Reflector) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    
    // Only audit mutations
    if (['GET', 'OPTIONS', 'HEAD'].includes(method)) {
      return next.handle();
    }

    const module = this.reflector.get<string>(AUDIT_MODULE_KEY, context.getHandler()) || 'GENERAL';
    const user = request.user;
    
    if (!user) return next.handle(); // No user, no audit (e.g. public endpoints)

    // Capture "before" state generically if this is an update/delete and has an ID param
    let beforeData = null;
    const targetId = request.params.id;
    if (targetId && method !== 'POST') {
      try {
        // We do a generic best-effort fetch if it's an update to a known module
        // In a real production system, the service would provide the before state,
        // but for this interceptor we'll capture what we can based on module.
        if (module === 'VENDORS') {
          beforeData = await this.prisma.shop.findUnique({ where: { id: targetId } });
        } else if (module === 'ORDERS') {
          beforeData = await this.prisma.booking.findUnique({ where: { id: targetId } });
        }
      } catch (e) {
        // ignore
      }
    }

    return next.handle().pipe(
      tap(async (response) => {
        // response contains the "after" state
        const afterData = response || null;
        const targetType = module;
        const finalTargetId = targetId || (response && response.id) || 'UNKNOWN';

        await this.prisma.auditLog.create({
          data: {
            actorId: user.id,
            action: method,
            module: module,
            targetType,
            targetId: finalTargetId,
            beforeData: beforeData ? JSON.parse(JSON.stringify(beforeData)) : null,
            afterData: afterData ? JSON.parse(JSON.stringify(afterData)) : null,
            ipAddress: request.ip,
          }
        });
      })
    );
  }
}
