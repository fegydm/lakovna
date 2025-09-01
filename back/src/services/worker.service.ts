// File: back/src/services/worker.service.ts
// Last change: Added service for worker-driven organization interactions

import { prisma } from '../clients/prisma'
import { AuthUser } from 'common/types/universal/auth-status.types'
import { toAuthUser } from '../security/mapper.utils'

/**
 * Worker requests to join an organization
 */
export async function requestJoinOrganization(workerId: string, organizationId: string) {
  // Check if already member or request exists
  const existing = await prisma.membership.findFirst({
    where: { workerId, organizationId }
  })
  if (existing) {
    throw new Error('Already member or pending request exists')
  }

  const membership = await prisma.membership.create({
    data: {
      workerId,
      organizationId,
      role: 'worker',
      status: 'PENDING'
    }
  })

  return membership
}

/**
 * Worker accepts invite via token (invite must be pre-created by org)
 */
export async function acceptInvite(workerId: string, inviteToken: string) {
  const invite = await prisma.invite.findUnique({ where: { token: inviteToken } })
  if (!invite || invite.expiresAt < new Date()) {
    throw new Error('Invalid or expired invite token')
  }

  // Attach worker to org
  const membership = await prisma.membership.create({
    data: {
      workerId,
      organizationId: invite.organizationId,
      role: invite.role,
      status: 'ACTIVE'
    }
  })

  // Delete invite after use
  await prisma.invite.delete({ where: { id: invite.id } })

  return membership
}

/**
 * Worker leaves an organization
 */
export async function leaveOrganization(workerId: string, organizationId: string) {
  const membership = await prisma.membership.findUnique({
    where: { workerId_organizationId: { workerId, organizationId } }
  })
  if (!membership) {
    throw new Error('Membership not found')
  }

  await prisma.membership.delete({
    where: { id: membership.id }
  })

  return { success: true }
}
