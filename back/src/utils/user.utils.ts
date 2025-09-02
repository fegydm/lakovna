// File: back/src/utils/user.utils.ts
// Last change: Added type conversion from Prisma types to common types

import { prisma } from '../core/prisma.client';
import { AccessRole } from 'common/types/access-role.types';
import { AuthMethod, MembershipStatus } from 'common/types/auth.types';
import type { Prisma } from '@prisma/client';

// Helper function to convert Prisma enum to common enum
const convert_prisma_access_role = (prisma_role: any): AccessRole => {
  return prisma_role as AccessRole;
};

const convert_prisma_membership_status = (prisma_status: any): MembershipStatus => {
  return prisma_status as MembershipStatus;
};

const convert_prisma_auth_method = (prisma_method: any): AuthMethod => {
  return prisma_method as AuthMethod;
};

export const get_user_with_memberships = async (
  user_id: string,
  status: MembershipStatus
) => {
  const result = await prisma.user.findUnique({
    where: { id: user_id },
    include: {
      memberships: {
        where: { status },
        select: { 
          organization_id: true, 
          access_role: true, 
          business_role: true,
          status: true
        },
      },
    },
  });

  if (!result) return null;

  // Convert Prisma types to common types
  return {
    ...result,
    memberships: result.memberships.map(membership => ({
      ...membership,
      access_role: convert_prisma_access_role(membership.access_role),
      status: convert_prisma_membership_status(membership.status)
    }))
  };
};

export const get_user_by_email = async (email: string) => {
  const result = await prisma.user.findUnique({
    where: { email },
    include: {
      memberships: {
        select: { 
          organization_id: true, 
          access_role: true, 
          business_role: true,
          status: true
        },
      },
    },
  });

  if (!result) return null;

  // Convert Prisma types to common types
  return {
    ...result,
    memberships: result.memberships.map(membership => ({
      ...membership,
      access_role: convert_prisma_access_role(membership.access_role),
      status: convert_prisma_membership_status(membership.status)
    }))
  };
};

export const create_user_and_organization = async (
  user_name: string,
  user_email: string,
  hashed_password: string,
  organization_name: string,
  organization_type: string,
  access_role: AccessRole,
  business_role: string
) => {
  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const user = await tx.user.create({
      data: {
        email: user_email,
        name: user_name,
        password: hashed_password,
        is_active: true,
      },
    });

    const organization = await tx.organization.create({
      data: {
        name: organization_name,
        type: organization_type,
      },
    });

    const membership = await tx.membership.create({
      data: {
        user_id: user.id,
        organization_id: organization.id,
        access_role: access_role,
        business_role: business_role,
        status: MembershipStatus.ACTIVE,
        auth_methods: [AuthMethod.PASSWORD],
      },
    });

    return { user, organization, membership };
  });

  // Convert Prisma types to common types
  return {
    ...result,
    membership: {
      ...result.membership,
      access_role: convert_prisma_access_role(result.membership.access_role),
      status: convert_prisma_membership_status(result.membership.status),
      auth_methods: result.membership.auth_methods.map(method => 
        convert_prisma_auth_method(method)
      )
    }
  };
};

export const get_user_by_terminal_auth = async (
  auth_method: 'rfid' | 'qr' | 'usb',
  auth_value: string
) => {
  const where_clause = {
    is_active: true,
    memberships: {
      some: {
        status: MembershipStatus.ACTIVE,
        [auth_method === 'rfid' ? 'rfid_tag' : auth_method === 'qr' ? 'qr_code' : 'usb_key_id']: auth_value,
      },
    },
  };

  const result = await prisma.user.findFirst({
    where: where_clause,
    include: {
      memberships: {
        where: { status: MembershipStatus.ACTIVE },
        select: {
          organization_id: true,
          access_role: true,
          business_role: true,
          status: true
        }
      },
    },
  });

  if (!result) return null;

  // Convert Prisma types to common types
  return {
    ...result,
    memberships: result.memberships.map(membership => ({
      ...membership,
      access_role: convert_prisma_access_role(membership.access_role),
      status: convert_prisma_membership_status(membership.status)
    }))
  };
};