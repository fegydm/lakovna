// File: common/types/organization.types.ts
// Last change: Updated imports after atomizing project.types.ts.

import type { AccessRole, MembershipStatus } from '@prisma/client';
// ZMENA: Importujeme priamo z auth.types.ts, keďže project.types.ts už neexistuje.
import type { AuthUser, Invite } from './auth.types';

// Payloads (Input types for bridge functions)
export interface CreateMembershipPayload {
  userId: string;
  organizationId: string;
  accessRole: AccessRole;
  status: MembershipStatus;
  businessRole?: string | null;
  authMethods?: string[];
}

export interface CreateInvitePayload {
  organizationId: string;
  email: string;
  accessRole: AccessRole;
  token: string;
  expiresAt: Date;
}

export interface CreateOrgWithOwnerPayload {
  userName: string;
  userEmail: string;
  hashedPassword: string;
  orgName: string;
  orgType: string;
}

export interface UpdateOrganizationPayload {
  name?: string;
  type?: string;
  description?: string;
}

// DTOs (Data Transfer Objects - return types from bridge)
export interface MembershipDTO {
  id: string;
  userId: string;
  organizationId: string;
  accessRole: AccessRole;
  businessRole: string | null;
  status: MembershipStatus;
  authMethods: string[];
  user?: Pick<AuthUser, 'id' | 'email' | 'name' | 'isVerified'>;
}

export type InviteDTO = Invite;

export interface OrganizationDTO {
  id: string;
  name: string;
  type: string;
  description: string | null;
  isVerified: boolean;
}

export interface LimitedMemberInfoDTO {
  userName: string;
  businessRole: string | null;
}

export type OrganizationMembersListDTO = MembershipDTO[] | LimitedMemberInfoDTO[];