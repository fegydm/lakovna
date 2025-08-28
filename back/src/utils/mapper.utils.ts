// File: back/src/utils/mapper.utils.ts
// Last change: Unified safe/unsafe worker → AuthUser mapping

import { AccessRole } from 'common/types/access-role.types';
import { AuthUser } from 'common/types/auth-user.types';

// Instead of duplicating, derive from Prisma types when available.
// If Prisma is removed, keep this minimal interface.
export interface WorkerLike {
  id: string;
  email: string;
  name: string;
  role: AccessRole | string;
  isActive: boolean;
  memberships?: Array<{
    organizationId: string;
    role: AccessRole | string;
  }>;
}

/**
 * Safe mapping: validates required fields and casts roles properly.
 */
export function toAuthUser(worker: WorkerLike | null): AuthUser | null {
  if (!worker) return null;

  if (!worker.id || !worker.email || !worker.name || !worker.role) {
    throw new Error('Invalid worker data: missing required fields');
  }

  return {
    id: worker.id,
    email: worker.email,
    name: worker.name,
    role: worker.role as AccessRole,
    isActive: worker.isActive,
    memberships: worker.memberships?.map(m => ({
      organizationId: m.organizationId,
      role: m.role as AccessRole,
    })) ?? [],
  };
}

/**
 * Unsafe mapping: assumes data is valid, minimal casting.
 */
export function toAuthUserUnsafe(worker: any): AuthUser {
  return {
    id: worker.id,
    email: worker.email,
    name: worker.name,
    role: worker.role as AccessRole,
    isActive: worker.isActive,
    memberships: worker.memberships?.map((m: any) => ({
      organizationId: m.organizationId,
      role: m.role as AccessRole,
    })) ?? [],
  };
}
