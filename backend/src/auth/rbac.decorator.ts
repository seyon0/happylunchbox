import { SetMetadata } from '@nestjs/common';

export const REQUIRE_PERMISSION_KEY = 'require_permission';

export interface PermissionRequirement {
  module: string;
  action: 'READ' | 'WRITE' | 'DELETE';
}

export const RequirePermission = (module: string, action: 'READ' | 'WRITE' | 'DELETE') => 
  SetMetadata(REQUIRE_PERMISSION_KEY, { module, action });
