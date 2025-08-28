// File: back/src/services/organization.service.ts
// Last change: Added service for owner/manager-driven organization management

import { prisma } from '../lib/prisma'
import { AccessRole } from 'common/types/access-role.types'

/**
 * Owner/Manager invites a worker by email
 */
export async function inviteWorkerByEmail(ownerId: string, orgId: string, email: string, role: AccessRole) {
  // Ensure inviter is owner/manager of org
  const inviter = await prisma.membership.findFirst({
    where: { workerId: ownerId, organizationId: orgId, role: { in: ['owner', 'manager'] }, status: 'ACTIVE' }
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
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }
  })

  return invite
}

/**
 * Approve a pending membership request
 */
export async function approveMembershipRequest(ownerId: string, requestId: string) {
  const membership = await prisma.membership.findUnique({ where: { id: requestId } })
  if (!membership || membership.status !== 'PENDING') {
    throw new Error('Request not found or already processed')
  }

  // Verify approver is owner/manager of org
  const approver = await prisma.membership.findFirst({
    where: { workerId: ownerId, organizationId: membership.organizationId, role: { in: ['owner', 'manager'] } }
  })
  if (!approver) {
    throw new Error('Forbidden: insufficient permissions')
  }

  return prisma.membership.update({
    where: { id: membership.id },
    data: { status: 'ACTIVE' }
  })
}

/**
 * Remove a worker from an organization
 */
export async function removeWorkerFromOrg(ownerId: string, orgId: string, workerId: string) {
  const approver = await prisma.membership.findFirst({
    where: { workerId: ownerId, organizationId: orgId, role: { in: ['owner', 'manager'] } }
  })
  if (!approver) throw new Error('Forbidden: insufficient permissions')

  await prisma.membership.deleteMany({
    where: { workerId, organizationId: orgId }
  })

  return { success: true }
}

/**
 * Change a worker's role inside an organization
 */
export async function changeWorkerRole(ownerId: string, orgId: string, workerId: string, role: AccessRole) {
  const approver = await prisma.membership.findFirst({
    where: { workerId: ownerId, organizationId: orgId, role: { in: ['owner', 'manager'] } }
  })
  if (!approver) throw new Error('Forbidden: insufficient permissions')

  return prisma.membership.updateMany({
    where: { workerId, organizationId: orgId },
    data: { role }
  })
}
