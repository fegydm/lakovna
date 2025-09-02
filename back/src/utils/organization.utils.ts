// File: back/src/utils/organization.utils.ts
// Last change: Fixed auth_methods type conversion between common and Prisma enums

import { prisma } from '../core/prisma.client';
import { AccessRole } from 'common/types/access-role.types';
import { MembershipStatus, AuthMethod } from 'common/types/auth.types';
import type { Prisma } from '@prisma/client';

// ==================================================
// Type conversion helpers
// ==================================================
const convert_prisma_access_role = (prisma_role: Prisma.AccessRole): AccessRole =>
  prisma_role as AccessRole;

const convert_prisma_membership_status = (prisma_status: Prisma.MembershipStatus): MembershipStatus =>
  prisma_status as MembershipStatus;

const convert_prisma_auth_methods = (methods: Prisma.AuthMethod[]): AuthMethod[] =>
  methods.map(m => m as AuthMethod);

// ==================================================
// MEMBERSHIP CRUD
// ==================================================
export async function create_membership(data: {
  user_id: string;
  organization_id: string;
  access_role: AccessRole;
  business_role?: string | null;
  status: MembershipStatus;
  auth_methods?: AuthMethod[];
  rfid_tag?: string | null;
  qr_code?: string | null;
  usb_key_id?: string | null;
}) {
  const result = await prisma.membership.create({
    data: {
      ...data,
      auth_methods: data.auth_methods as unknown as Prisma.AuthMethod[] | undefined,
    },
  });
  return {
    ...result,
    access_role: convert_prisma_access_role(result.access_role),
    status: convert_prisma_membership_status(result.status),
    auth_methods: convert_prisma_auth_methods(result.auth_methods),
  };
}

export async function get_membership_by_user_and_org(user_id: string, organization_id: string) {
  const result = await prisma.membership.findFirst({
    where: { user_id, organization_id },
  });
  if (!result) return null;
  return {
    ...result,
    access_role: convert_prisma_access_role(result.access_role),
    status: convert_prisma_membership_status(result.status),
    auth_methods: convert_prisma_auth_methods(result.auth_methods),
  };
}

export async function get_membership_by_id(membership_id: string) {
  const result = await prisma.membership.findUnique({ where: { id: membership_id } });
  if (!result) return null;
  return {
    ...result,
    access_role: convert_prisma_access_role(result.access_role),
    status: convert_prisma_membership_status(result.status),
    auth_methods: convert_prisma_auth_methods(result.auth_methods),
  };
}

export async function update_membership_status(membership_id: string, status: MembershipStatus) {
  const result = await prisma.membership.update({
    where: { id: membership_id },
    data: { status },
  });
  return {
    ...result,
    access_role: convert_prisma_access_role(result.access_role),
    status: convert_prisma_membership_status(result.status),
    auth_methods: convert_prisma_auth_methods(result.auth_methods),
  };
}

export async function update_membership_role(user_id: string, organization_id: string, access_role: AccessRole) {
  const result = await prisma.membership.update({
    where: { user_id_organization_id: { user_id, organization_id } },
    data: { access_role },
  });
  return {
    ...result,
    access_role: convert_prisma_access_role(result.access_role),
    status: convert_prisma_membership_status(result.status),
    auth_methods: convert_prisma_auth_methods(result.auth_methods),
  };
}

export async function delete_membership(user_id: string, organization_id: string) {
  await prisma.membership.delete({
    where: { user_id_organization_id: { user_id, organization_id } },
  });
  return { success: true };
}

// ==================================================
// MEMBERSHIP HELPERS
// ==================================================
export async function count_owners_in_org(organization_id: string) {
  return prisma.membership.count({
    where: {
      organization_id,
      access_role: AccessRole.OWNER,
      status: MembershipStatus.ACTIVE,
    },
  });
}

// ==================================================
// INVITE CRUD
// ==================================================
export async function create_invite(data: {
  organization_id: string;
  email: string;
  access_role: AccessRole;
  token: string;
  expires_at: Date;
}) {
  const result = await prisma.invite.create({ data });
  return {
    ...result,
    access_role: convert_prisma_access_role(result.access_role),
  };
}

export async function get_invite_by_token(token: string) {
  const result = await prisma.invite.findUnique({ where: { token } });
  if (!result) return null;
  return {
    ...result,
    access_role: convert_prisma_access_role(result.access_role),
  };
}

export async function delete_invite(invite_id: string) {
  await prisma.invite.delete({ where: { id: invite_id } });
  return { success: true };
}

// ==================================================
// ORGANIZATION CRUD
// ==================================================
export async function get_organization_by_id(organization_id: string) {
  return prisma.organization.findUnique({ where: { id: organization_id } });
}

export async function update_organization(
  organization_id: string,
  data: { name?: string; type?: string; description?: string }
) {
  return prisma.organization.update({ where: { id: organization_id }, data });
}
