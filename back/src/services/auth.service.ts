// File: back/src/services/auth.service.ts
// Last change: Finalized service layer with type-safe terminal login and unified utils

import { prisma } from '../core/prisma.client';
import { Prisma } from '@prisma/client';
import { hashPassword, verifyPassword } from '../auth/crypto.utils';
import { signToken } from '../auth/jwt.utils';
import { toAuthUser } from '../auth/mapper.utils';
import { AuthUser } from 'common/types/auth.types';

/**
 * Register a new organization with an owner account
 */
export async function registerAndCreateOrgService(
  organizationName: string,
  workerName: string,
  email: string,
  password: string
) {
  const existingWorker = await prisma.worker.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existingWorker) throw new Error('Worker with this email already exists');

  const hashedPassword = await hashPassword(password);

  const { newWorker, newOrganization } = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const organization = await tx.organization.create({
        data: { name: organizationName },
      });

      const worker = await tx.worker.create({
        data: {
          name: workerName,
          email: email.toLowerCase(),
          password: hashedPassword,
          role: 'owner',
          memberships: {
            create: {
              organizationId: organization.id,
              role: 'owner',
              status: 'ACTIVE',
            },
          },
        },
        include: {
          memberships: {
            where: { status: 'ACTIVE' as const },
            select: { organizationId: true, role: true },
          },
        },
      });
      return { newWorker: worker, newOrganization: organization };
    }
  );

  const authUser = toAuthUser(newWorker);
  if (!authUser) throw new Error('Failed to map user after registration');

  const token = signToken(authUser);
  return { token, worker: authUser, organization: newOrganization };
}

/**
 * Login worker with email/password
 */
export async function loginWorkerService(email: string, password: string) {
  const worker = await prisma.worker.findUnique({
    where: { email: email.toLowerCase() },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      password: true,
      isActive: true,
      memberships: {
        where: { status: 'ACTIVE' as const },
        select: { organizationId: true, role: true },
      },
    },
  });

  if (!worker || !worker.password) throw new Error('Invalid credentials');

  const isPasswordValid = await verifyPassword(password, worker.password);
  if (!isPasswordValid) throw new Error('Invalid credentials');

  const authUser = toAuthUser(worker);
  if (!authUser) throw new Error('Failed to map user after login');

  const token = signToken(authUser);
  return { token, worker: authUser };
}

/**
 * Login worker via terminal (rfid, qr, usb)
 */
export async function loginTerminalService(
  authMethod: 'rfid' | 'qr' | 'usb',
  authValue: string
) {
  let worker;

  if (authMethod === 'rfid') {
    worker = await prisma.worker.findUnique({
      where: { rfidTag: authValue },
      include: {
        memberships: {
          where: { status: 'ACTIVE' as const },
          select: { organizationId: true, role: true },
        },
      },
    });
  } else if (authMethod === 'qr') {
    worker = await prisma.worker.findUnique({
      where: { qrCode: authValue },
      include: {
        memberships: {
          where: { status: 'ACTIVE' as const },
          select: { organizationId: true, role: true },
        },
      },
    });
  } else if (authMethod === 'usb') {
    worker = await prisma.worker.findUnique({
      where: { usbKeyId: authValue },
      include: {
        memberships: {
          where: { status: 'ACTIVE' as const },
          select: { organizationId: true, role: true },
        },
      },
    });
  } else {
    throw new Error('Invalid auth method');
  }

  if (!worker) throw new Error('Invalid credentials or worker not found');
  if (!worker.isActive) throw new Error('Worker account is disabled');

  await prisma.workSession.create({ data: { workerId: worker.id, authMethod } });

  const authUser = toAuthUser(worker);
  if (!authUser) throw new Error('Failed to map user on terminal login');

  const token = signToken(authUser);
  return { token, worker: authUser };
}
