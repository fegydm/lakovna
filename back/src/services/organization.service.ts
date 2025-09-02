// File: back/src/services/organization.service.ts
// Last change: Updated for uppercase AccessRole values in Prisma schema

import { prisma } from '../core/prisma.client'
import type { AccessRole } from '../../../common/types/access-role.types'

export async function inviteWorkerByEmail(ownerId: string, orgId: string, email: string, role: AccessRole) {
  const inviter = await prisma.membership.findFirst({
    where: {
      workerId: ownerId,
      organizationId: orgId,
      role: { in: ['OWNER', 'MANAGER'] },
      status: 'ACTIVE',
    },
  })
  if (!inviter) {
    throw new Error('Forbidden: insufficient permissions')
  }

  const token = crypto.randomUUID()

  const invite = await prisma.invite.create({
    data: {
      organizationId: orgId,
      email: email.toLowerCase(),
      role,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })

  return invite
}

export async function approveMembershipRequest(ownerId: string, requestId: string) {
  const membership = await prisma.membership.findUnique({ where: { id: requestId } })
  if (!membership || membership.status !== 'PENDING') {
    throw new Error('Request not found or already processed')
  }

  const approver = await prisma.membership.findFirst({
    where: {
      workerId: ownerId,
      organizationId: membership.organizationId,
      role: { in: ['OWNER', 'MANAGER'] },
    },
  })
  if (!approver) {
    throw new Error('Forbidden: insufficient permissions')
  }

  return prisma.membership.update({
    where: { id: requestId },
    data: { status: 'ACTIVE' },
  })
}

export async function removeWorkerFromOrg(ownerId: string, orgId: string, workerId: string) {
  const approver = await prisma.membership.findFirst({
    where: {
      workerId: ownerId,
      organizationId: orgId,
      role: { in: ['OWNER', 'MANAGER'] },
    },
  })
  if (!approver) throw new Error('Forbidden: insufficient permissions')

  await prisma.membership.deleteMany({
    where: { workerId, organizationId: orgId },
  })

  return { success: true }
}

export async function changeWorkerRole(ownerId: string, orgId: string, workerId: string, role: AccessRole) {
  const approver = await prisma.membership.findFirst({
    where: {
      workerId: ownerId,
      organizationId: orgId,
      role: { in: ['OWNER', 'MANAGER'] },
    },
  })
  if (!approver) throw new Error('Forbidden: insufficient permissions')

  return prisma.membership.updateMany({
    where: { workerId, organizationId: orgId },
    data: { role },
  })
}