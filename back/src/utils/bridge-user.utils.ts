// File: back/src/utils/bridge-user.utils.ts
// Last change: Aligned with the Bridge Layer Architecture (snake_case I/O).

import { prisma } from '../core/prisma.client';
import { Prisma } from '@prisma/client';

// Defines the shape of data passed to create a user.
interface CreateUserInput {
  name: string;
  email: string;
  password?: string;
  is_active?: boolean;
  is_verified?: boolean;
}

// Defines the shape of data passed to update a user.
interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  is_active?: boolean;
  is_verified?: boolean;
}

// Type for the full user object returned by Prisma, including relations.
type PrismaUserWithMemberships = Prisma.UserGetPayload<{
  include: { memberships: true };
}>;

/**
 * A local mapper to convert a Prisma user object (camelCase) to a bridge user object (snake_case).
 * This ensures the bridge layer always outputs snake_case, as per conventions.
 * @param user - The user object from Prisma.
 * @returns A user object with snake_case properties, or null if input is null.
 */
function map_prisma_to_bridge_user(user: PrismaUserWithMemberships | null) {
  if (!user) {
    return null;
  }
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    password: user.password,
    is_verified: user.is_verified,
    is_active: user.is_active,
    memberships: user.memberships.map((m) => ({
      id: m.id,
      user_id: m.user_id,
      organization_id: m.organization_id,
      access_role: m.access_role,
      business_role: m.business_role,
      status: m.status,
      rfid_tag: m.rfid_tag,
      qr_code: m.qr_code,
      usb_key_id: m.usb_key_id,
    })),
  };
}

export const get_user_by_email = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { memberships: true },
  });
  return map_prisma_to_bridge_user(user);
};

export const get_user_by_terminal_auth = async (
  method: 'rfid' | 'qr' | 'usb',
  value: string
) => {
  const fieldMap = {
    rfid: 'rfid_tag',
    qr: 'qr_code',
    usb: 'usb_key_id',
  };
  const key = fieldMap[method];

  const membership = await prisma.membership.findFirst({
    where: { [key]: value },
    include: { user: { include: { memberships: true } } },
  });

  return map_prisma_to_bridge_user(membership?.user || null);
};

export const get_all_users_from_db = async () => {
  const users = await prisma.user.findMany({
    include: { memberships: true },
  });
  return users.map(map_prisma_to_bridge_user);
};

export const get_user_by_id_from_db = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { memberships: true },
  });
  return map_prisma_to_bridge_user(user);
};

export const create_user = async (data: CreateUserInput) => {
  // Prisma expects camelCase for relation fields, but snake_case for scalar fields from schema.
  // The data object already matches the schema fields.
  const user = await prisma.user.create({
    data,
    include: { memberships: true },
  });
  return map_prisma_to_bridge_user(user);
};

export const update_user_in_db = async (id: string, data: UpdateUserInput) => {
  const user = await prisma.user.update({
    where: { id },
    data,
    include: { memberships: true },
  });
  return map_prisma_to_bridge_user(user);
};

