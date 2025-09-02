// File: back/src/services/worker.service.ts
// Last change: Refactored to use bridge utils, enums, and consistent return types

import { prisma } from '../core/prisma.client';
import { AccessRole } from 'common/types/access-role.types';
import { MembershipStatus } from 'common/types/auth.types';
import { get_membership_by_user_and_org } from '../utils/organization.utils';

// ==================================================
// REQUEST TO JOIN ORGANIZATION
// ==================================================
export async function request_join_organization_service(
  user_id: string,
  organization_id: string
) {
  // Check if already a member or pending request exists
  const existing = await prisma.membership.findFirst({
    where: { user_id, organization_id },
  });
  if (existing) {
    throw new Error('Already member or pending request exists');
  }

  const membership = await prisma.membership.create({
    data: {
      user_id,
      organization_id,
      access_role: AccessRole.WORKER,
      status: MembershipStatus.PENDING,
      auth_methods: [],
    },
  });

  return { success: true, membership };
}

// ==================================================
// ACCEPT INVITE VIA TOKEN
// ==================================================
export async function accept_invite_service(user_id: string, invite_token: string) {
  const invite = await prisma.invite.findUnique({
    where: { token: invite_token },
  });

  if (!invite || invite.expires_at < new Date()) {
    throw new Error('Invalid or expired invite token');
  }

  // Check if user is already member
  const existing = await get_membership_by_user_and_org(user_id, invite.organization_id);
  if (existing) {
    throw new Error('Already a member of this organization');
  }

  const membership = await prisma.membership.create({
    data: {
      user_id,
      organization_id: invite.organization_id,
      access_role: invite.access_role,
      status: MembershipStatus.ACTIVE,
      auth_methods: [],
    },
  });

  // Delete invite after acceptance
  await prisma.invite.delete({ where: { id: invite.id } });

  return { success: true, membership };
}

// ==================================================
// LEAVE ORGANIZATION
// ==================================================
export async function leave_organization_service(user_id: string, organization_id: string) {
  const membership = await prisma.membership.findUnique({
    where: { user_id_organization_id: { user_id, organization_id } },
  });
  if (!membership) {
    throw new Error('Membership not found');
  }

  // Prevent leaving if user is the last owner
  if (membership.access_role === AccessRole.OWNER) {
    const owners_count = await prisma.membership.count({
      where: {
        organization_id,
        access_role: AccessRole.OWNER,
        status: MembershipStatus.ACTIVE,
      },
    });
    if (owners_count <= 1) {
      throw new Error('Cannot leave organization as the last owner');
    }
  }

  await prisma.membership.delete({
    where: { id: membership.id },
  });

  return { success: true, removed_user_id: user_id };
}
