// File: back/src/utils/bridge-organization.utils.ts
// Last change: Refactored to full camelCase, strong types (DTOs), and SSoT conventions.

import { prisma } from '../core/prisma.client';
import { AccessRole, MembershipStatus } from '@prisma/client';
import { PRIVILEGED_ACCESS_ROLES } from 'common/configs/01-constants.config';
import type {
  CreateInvitePayload,
  CreateMembershipPayload,
  CreateOrgWithOwnerPayload,
  InviteDTO,
  MembershipDTO,
  OrganizationDTO,
  OrganizationMembersListDTO,
  UpdateOrganizationPayload,
} from 'common/types/organization.types';

export async function createMembership(data: CreateMembershipPayload): Promise<MembershipDTO> {
  return prisma.membership.create({ data });
}

export async function getMembershipByUserAndOrg(userId: string, organizationId: string): Promise<MembershipDTO | null> {
  return prisma.membership.findUnique({
    where: { userId_organizationId: { userId, organizationId } },
    include: { user: { select: { id: true, email: true, name: true, isVerified: true } } },
  });
}

export async function getMembershipById(membershipId: string): Promise<MembershipDTO | null> {
  return prisma.membership.findUnique({
    where: { id: membershipId },
    include: { user: { select: { id: true, email: true, name: true, isVerified: true } } },
  });
}

export async function updateMembershipStatus(membershipId: string, status: MembershipStatus): Promise<MembershipDTO> {
  return prisma.membership.update({
    where: { id: membershipId },
    data: { status },
  });
}

export async function updateMembershipRole(userId: string, organizationId: string, accessRole: AccessRole): Promise<MembershipDTO> {
  return prisma.membership.update({
    where: { userId_organizationId: { userId, organizationId } },
    data: { accessRole },
  });
}

export async function deleteMembership(userId: string, organizationId: string): Promise<{ success: boolean }> {
  await prisma.membership.delete({
    where: { userId_organizationId: { userId, organizationId } },
  });
  return { success: true };
}

export async function countOwnersInOrg(organizationId: string): Promise<number> {
  return prisma.membership.count({
    where: {
      organizationId,
      accessRole: AccessRole.OWNER,
      status: MembershipStatus.ACTIVE,
    },
  });
}

export async function createInvite(data: CreateInvitePayload): Promise<InviteDTO> {
  return prisma.invite.create({ data });
}

export async function getInviteByToken(token: string): Promise<InviteDTO | null> {
  return prisma.invite.findUnique({ where: { token } });
}

export async function deleteInvite(inviteId: string): Promise<{ success: boolean }> {
  await prisma.invite.delete({ where: { id: inviteId } });
  return { success: true };
}

export async function getOrganizationById(organizationId: string): Promise<OrganizationDTO | null> {
  return prisma.organization.findUnique({ where: { id: organizationId } });
}

export async function updateOrganization(organizationId: string, data: UpdateOrganizationPayload): Promise<OrganizationDTO> {
  return prisma.organization.update({ where: { id: organizationId }, data });
}

export async function createOrganizationWithOwner(data: CreateOrgWithOwnerPayload) {
  const { userName, userEmail, hashedPassword, orgName, orgType } = data;

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: userEmail,
        name: userName,
        password: hashedPassword,
        isActive: true,
        isVerified: true,
      },
    });

    const organization = await tx.organization.create({
      data: { name: orgName, type: orgType },
    });

    const membership = await tx.membership.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        accessRole: AccessRole.OWNER,
        status: MembershipStatus.ACTIVE,
      },
      // ZMENA: Pridáme `include`, aby sme mali všetky dáta pre MembershipDTO
      include: {
        user: { select: { id: true, email: true, name: true, isVerified: true } },
      }
    });

    // ZMENA: Manuálne zložíme user objekt, aby zodpovedal UserDTO
    const userWithMembership: UserDTO = {
      ...user,
      memberships: [membership],
    };

    return { user: userWithMembership, organization, membership };
  });
}

export async function countActiveMembersInOrg(organizationId: string): Promise<number> {
  return prisma.membership.count({
    where: { organizationId, status: MembershipStatus.ACTIVE },
  });
}

export async function countVehiclesInOrg(organizationId: string): Promise<number> {
  return prisma.vehicle.count({ where: { organizationId } });
}

export async function getOrganizationMembersList(organizationId: string, requesterRole: AccessRole): Promise<OrganizationMembersListDTO> {
  const isPrivilegedView = (PRIVILEGED_ACCESS_ROLES as readonly string[]).includes(requesterRole);

  if (isPrivilegedView) {
    return prisma.membership.findMany({
      where: { organizationId, status: MembershipStatus.ACTIVE },
      include: {
        user: { select: { id: true, email: true, name: true, isVerified: true } },
      },
    });
  } else {
    const members = await prisma.membership.findMany({
      where: { organizationId, status: MembershipStatus.ACTIVE },
      select: {
        user: { select: { name: true } },
        businessRole: true,
      },
    });
    return members.map((m) => ({
      userName: m.user?.name || 'Unknown',
      businessRole: m.businessRole,
    }));
  }
}