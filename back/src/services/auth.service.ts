// File: back/src/services/auth.service.ts

import { prisma } from '../core/prisma.client'
import { hashPassword, verifyPassword } from '../auth/crypto.utils'
import { signToken } from '../auth/jwt.utils'
import { AccessRole, MembershipStatus, AuthMethod } from '../../../database/generated'

// ================================================
// REGISTER + CREATE ORG
// ================================================
export async function registerAndCreateOrgService(
  organizationName: string,
  workerName: string,
  email: string,
  password: string
) {
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })
  if (existingUser) throw new Error('User with this email already exists')

  const hashedPassword = await hashPassword(password)

  const result = await prisma.$transaction(async (tx) => {
    // 1) Create user
    const user = await tx.user.create({
      data: {
        email: email.toLowerCase(),
        name: workerName,
        password: hashedPassword, // <-- OPRAVENÉ: Ukladanie hashovaného hesla
        isActive: true,
      },
    })

    // 2) Create organization
    const organization = await tx.organization.create({
      data: {
        name: organizationName,
        type: 'bodyshop',
      },
    })

    // 3) Create worker profile
    const worker = await tx.worker.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        accessRole: AccessRole.OWNER,
        businessRole: 'shop-owner',
        isActive: true,
        authMethods: [AuthMethod.PASSWORD],
      },
    })

    // 4) Create membership
    const membership = await tx.membership.create({
      data: {
        workerId: worker.id,
        organizationId: organization.id,
        role: AccessRole.OWNER,
        status: MembershipStatus.ACTIVE,
      },
    })

    return { user, organization, worker, membership }
  })

  const token = signToken({
    userId: result.user.id,
    organizationId: result.organization.id,
    accessRole: result.worker.accessRole,
  })

  return {
    token,
    user: result.user,
    organization: result.organization,
    worker: result.worker,
  }
}

// ================================================
// LOGIN (EMAIL + PASSWORD)
// ================================================
export async function loginWorkerService(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: {
      workers: {
        include: {
          memberships: {
            where: { status: MembershipStatus.ACTIVE },
          },
          organization: true,
        },
      },
    },
  })

  if (!user || !user.password) throw new Error('Invalid credentials')

  const isPasswordValid = await verifyPassword(password, user.password)
  if (!isPasswordValid) throw new Error('Invalid credentials')

  if (user.workers.length === 0) throw new Error('No active worker profile found')

  const primaryWorker = user.workers[0]
  const primaryMembership = primaryWorker.memberships[0]

  // <-- OPRAVENÉ: Overenie existencie členstva
  if (!primaryMembership) {
    throw new Error('No active membership found for this worker')
  }

  const token = signToken({
    userId: user.id,
    organizationId: primaryMembership.organizationId,
    accessRole: primaryWorker.accessRole,
  })

  return { token, user, worker: primaryWorker }
}

// ================================================
// LOGIN (TERMINAL AUTH: RFID / QR / USB)
// ================================================
export async function loginTerminalService(
  authMethod: 'rfid' | 'qr' | 'usb',
  authValue: string
) {
  let worker

  const includeOptions = {
    include: {
      user: true,
      organization: true,
      memberships: {
        where: { status: MembershipStatus.ACTIVE },
        include: { organization: true },
      },
    },
  }

  // Použijeme dynamický where objekt
  const whereClause = { isActive: true }
  if (authMethod === 'rfid') {
    whereClause.rfidTag = authValue
  } else if (authMethod === 'qr') {
    whereClause.qrCode = authValue
  } else if (authMethod === 'usb') {
    whereClause.usbKeyId = authValue
  } else {
    throw new Error('Invalid auth method')
  }

  worker = await prisma.worker.findFirst({
    where: whereClause,
    ...includeOptions,
  })

  if (!worker) throw new Error('Invalid credentials or worker not found')
  if (!worker.isActive) throw new Error('Worker account is disabled')

  const primaryMembership = worker.memberships[0]

  // <-- OPRAVENÉ: Overenie existencie členstva
  if (!primaryMembership) {
    throw new Error('No active membership found for this worker')
  }

  const token = signToken({
    userId: worker.userId,
    organizationId: primaryMembership.organizationId,
    accessRole: worker.accessRole,
  })

  return { token, user: worker.user, worker }
}