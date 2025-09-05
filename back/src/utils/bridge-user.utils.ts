// File: back/src/utils/bridge-user.utils.ts
// Last change: Refactored to full camelCase, strong types, and removed obsolete mapper.

import { prisma } from '../core/prisma.client';
import type { CreateUserPayload, UpdateUserPayload, UserDTO } from 'common/types/user.types';
import { AUTH_METHODS } from 'common/configs/01-constants.config';
import type { AuthMethod } from 'common/types/auth.types';

// Všetky funkcie teraz vracajú priamo Prisma objekt, pretože jeho štruktúra
// (vďaka camelCase v schéme) už zodpovedá nášmu UserDTO.
// Žiadne manuálne mapovanie nie je potrebné.

export async function getUserByEmail(email: string): Promise<UserDTO | null> {
  return prisma.user.findUnique({
    where: { email },
    include: { memberships: true },
  });
}

export async function getUserByTerminalAuth(method: AuthMethod, value: string): Promise<UserDTO | null> {
  // Mapa teraz správne mapuje SSoT konštanty na camelCase polia v Prisma modeli
  const fieldMap: Partial<Record<AuthMethod, keyof typeof prisma.membership.fields>> = {
    [AUTH_METHODS.RFID]: 'rfidTag',
    [AUTH_METHODS.QR]: 'qrCode',
    [AUTH_METHODS.USB]: 'usbKeyId',
  };
  
  const key = fieldMap[method];
  if (!key) return null; // Neplatná metóda

  const membership = await prisma.membership.findFirst({
    where: { [key]: value },
    include: { user: { include: { memberships: true } } },
  });

  return membership?.user ?? null;
}

export async function getAllUsers(): Promise<UserDTO[]> {
  return prisma.user.findMany({
    include: { memberships: true },
  });
}

export async function getUserById(id: string): Promise<UserDTO | null> {
  return prisma.user.findUnique({
    where: { id },
    include: { memberships: true },
  });
}

export async function createUser(data: CreateUserPayload): Promise<UserDTO> {
  // Vstupný `data` objekt je už v camelCase, takže ho môžeme priamo použiť
  return prisma.user.create({
    data,
    include: { memberships: true },
  });
}

export async function updateUser(id: string, data: UpdateUserPayload): Promise<UserDTO> {
  return prisma.user.update({
    where: { id },
    data,
    include: { memberships: true },
  });
}