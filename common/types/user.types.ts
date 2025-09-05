// File: common/types/user.types.ts
// Last change: Created dedicated types for user-related data structures.

import type { MembershipDTO } from './organization.types';

// Payloads (vstupné dáta pre bridge funkcie)
export interface CreateUserPayload {
  name: string;
  email: string;
  password?: string;
  isActive?: boolean;
  isVerified?: boolean;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  isActive?: boolean;
  isVerified?: boolean;
}

// DTO (výstupné dáta z bridge funkcií)
export interface UserDTO {
  id: string;
  email: string;
  name: string;
  password?: string | null;
  isVerified: boolean;
  isActive: boolean;
  memberships: MembershipDTO[];
}