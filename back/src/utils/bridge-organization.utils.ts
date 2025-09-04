// File: back/src/utils/bridge-organization.utils.ts
// Last change: Fixed TypeScript errors and aligned with Bridge Layer Architecture (snake_case I/O)

import { prisma } from '../core/prisma.client';
import {
  ACCESS_ROLES,
  AUTH_METHODS,
  MEMBERSHIP_STATUSES,
} from 'common/configs/01-constants.config';

interface CreateMembershipInput {
  user_id: string;
  organization_id: string;
  access_role: string;
  status: string;
  business_role?: string | null;
  auth_methods?: string[];
}

interface CreateInviteInput {
  organization_id: string;
  email: string;
  access_role: string;
  token: string;
  expires_at: Date;
}

interface CreateOrgWithOwnerInput {
  user_name: string;
  user_email: string;
  hashed_password: string;
  org_name: string;
  org_type: string;
}

interface BridgeMembership {
  id: string;
  user_id: string;
  organization_id: string;
  access_role: string;
  business_role: string | null;
  status: string;
  auth_methods: string[];
  rfid_tag: string | null;
  qr_code: string | null;
  usb_key_id: string | null;
  created_at: Date;
  updated_at: Date;
  user?: {
    id: string;
    email: string;
    name: string;
    is_verified: boolean;
  };
}

interface BridgeInvite {
  id: string;
  organization_id: string;
  email: string;
  access_role: string;
  token: string;
  expires_at: Date;
  created_at: Date;
}

function map_prisma_to_bridge_membership(
  membership: any
): BridgeMembership | null {
  if (!membership) return null;

  const bridgeMembership: BridgeMembership = {
    id: membership.id,
    user_id: membership.user_id,
    organization_id: membership.organization_id,
    access_role: membership.access_role,
    business_role: membership.business_role,
    status: membership.status,
    auth_methods: membership.auth_methods || [],
    rfid_tag: membership.rfid_tag,
    qr_code: membership.qr_code,
    usb_key_id: membership.usb_key_id,
    created_at: membership.created_at,
    updated_at: membership.updated_at,
  };

  if (membership.user) {
    bridgeMembership.user = {
      id: membership.user.id,
      email: membership.user.email,
      name: membership.user.name,
      is_verified: membership.user.is_verified,
    };
  }

  return bridgeMembership;
}

function map_prisma_to_bridge_invite(invite: any): BridgeInvite | null {
  if (!invite) return null;

  return {
    id: invite.id,
    organization_id: invite.organization_id,
    email: invite.email,
    access_role: invite.access_role,
    token: invite.token,
    expires_at: invite.expires_at,
    created_at: invite.created_at,
  };
}

export async function create_membership(data: CreateMembershipInput): Promise<BridgeMembership | null> {
  const result = await prisma.membership.create({ data });
  return map_prisma_to_bridge_membership(result);
}

export async function get_membership_by_user_and_org(
  user_id: string,
  organization_id: string
): Promise<BridgeMembership | null> {
  const result = await prisma.membership.findFirst({
    where: { user_id, organization_id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          is_verified: true,
        },
      },
    },
  });
  return map_prisma_to_bridge_membership(result);
}

export async function get_membership_by_id(membership_id: string): Promise<BridgeMembership | null> {
  const result = await prisma.membership.findUnique({
    where: { id: membership_id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          is_verified: true,
        },
      },
    },
  });
  return map_prisma_to_bridge_membership(result);
}

export async function update_membership_status(
  membership_id: string,
  status: string
): Promise<BridgeMembership | null> {
  const result = await prisma.membership.update({
    where: { id: membership_id },
    data: { status },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          is_verified: true,
        },
      },
    },
  });
  return map_prisma_to_bridge_membership(result);
}

export async function update_membership_role(
  user_id: string,
  organization_id: string,
  access_role: string
): Promise<BridgeMembership | null> {
  const result = await prisma.membership.update({
    where: {
      user_id_organization_id: {
        user_id: user_id,
        organization_id: organization_id,
      },
    },
    data: { access_role },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          is_verified: true,
        },
      },
    },
  });
  return map_prisma_to_bridge_membership(result);
}

export async function delete_membership(
  user_id: string,
  organization_id: string
): Promise<{ success: boolean }> {
  await prisma.membership.delete({
    where: {
      user_id_organization_id: {
        user_id: user_id,
        organization_id: organization_id,
      },
    },
  });
  return { success: true };
}

export async function count_owners_in_org(organization_id: string): Promise<number> {
  return prisma.membership.count({
    where: {
      organization_id,
      access_role: ACCESS_ROLES.OWNER,
      status: MEMBERSHIP_STATUSES.ACTIVE,
    },
  });
}

export async function create_invite(data: CreateInviteInput): Promise<BridgeInvite | null> {
  const result = await prisma.invite.create({ data });
  return map_prisma_to_bridge_invite(result);
}

export async function get_invite_by_token(token: string): Promise<BridgeInvite | null> {
  const result = await prisma.invite.findUnique({ where: { token } });
  return map_prisma_to_bridge_invite(result);
}

export async function delete_invite(invite_id: string): Promise<{ success: boolean }> {
  await prisma.invite.delete({ where: { id: invite_id } });
  return { success: true };
}

export async function get_organization_by_id(organization_id: string): Promise<any> {
  return prisma.organization.findUnique({ where: { id: organization_id } });
}

export async function update_organization(
  organization_id: string,
  data: { name?: string; type?: string; description?: string }
): Promise<any> {
  return prisma.organization.update({ where: { id: organization_id }, data });
}

export async function create_organization_with_owner(
  data: CreateOrgWithOwnerInput
): Promise<{
  user: {
    id: string;
    name: string;
    email: string;
    is_verified: boolean;
    is_active: boolean;
    password: string | null;
  };
  organization: any;
  membership: BridgeMembership | null;
}> {
  const { user_name, user_email, hashed_password, org_name, org_type } = data;

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: user_email,
        name: user_name,
        password: hashed_password,
        is_active: true,
        is_verified: false,
      },
    });

    const organization = await tx.organization.create({
      data: { name: org_name, type: org_type },
    });

    const membership = await tx.membership.create({
      data: {
        user_id: user.id,
        organization_id: organization.id,
        access_role: ACCESS_ROLES.OWNER,
        status: MEMBERSHIP_STATUSES.ACTIVE,
        auth_methods: [AUTH_METHODS.PASSWORD],
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_verified: user.is_verified,
        is_active: user.is_active,
        password: user.password,
      },
      organization,
      membership: map_prisma_to_bridge_membership(membership),
    };
  });
}

export async function count_active_members_in_org(organization_id: string): Promise<number> {
  return prisma.membership.count({
    where: { organization_id, status: MEMBERSHIP_STATUSES.ACTIVE },
  });
}

export async function count_vehicles_in_org(organization_id: string): Promise<number> {
  return prisma.vehicle.count({ where: { organization_id } });
}

export async function get_organization_members_list(
  organization_id: string,
  requester_role: string
): Promise<BridgeMembership[] | Array<{ user_name: string; business_role: string | null }>> {
  const privilegedRoles: string[] = [ACCESS_ROLES.OWNER, ACCESS_ROLES.MANAGER];
  const isPrivilegedView = privilegedRoles.includes(requester_role);

  if (isPrivilegedView) {
    const members = await prisma.membership.findMany({
      where: { organization_id, status: MEMBERSHIP_STATUSES.ACTIVE },
      include: {
        user: {
          select: { id: true, email: true, name: true, is_verified: true },
        },
      },
    });
    return members.map(map_prisma_to_bridge_membership).filter(Boolean) as BridgeMembership[];
  } else {
    const members = await prisma.membership.findMany({
      where: { organization_id, status: MEMBERSHIP_STATUSES.ACTIVE },
      select: {
        user: { select: { name: true } },
        business_role: true,
      },
    });
    return members.map((m) => ({
      user_name: m.user?.name || 'Unknown',
      business_role: m.business_role,
    }));
  }
}