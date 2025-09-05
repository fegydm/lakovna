// File: back/src/services/auth.service.ts
// Last change: Final version aligned with clean DTOs and business logic separation.

import { getUserByEmail, getUserByTerminalAuth } from '../utils/bridge-user.utils';
import { createOrganizationWithOwner } from '../utils/bridge-organization.utils';
import { hashPassword, verifyPassword } from '../utils/auth-crypto.utils';
import { signToken } from '../utils/auth-jwt.utils';
import { PROJECT_ORG_TYPES } from 'common/configs/01-constants.config';
import { MembershipStatus } from '@prisma/client';
import type { UserDTO } from 'common/types/user.types';
import type { MembershipDTO } from 'common/types/organization.types';
import type { AuthResponse, AuthUser, AuthMethod } from 'common/types/auth.types';

// =================================================================
// ERROR CLASSES
// =================================================================

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

class UserNotFoundError extends AuthenticationError {
  constructor(message = 'Invalid credentials') {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

// =================================================================
// MAPPERS & HELPERS
// =================================================================

/**
 * Transforms a raw UserDTO from the bridge into an application-specific AuthUser.
 * This is where business logic (like determining a primary role) is applied.
 * @param user - The UserDTO object from the bridge.
 * @param primaryMembership - The membership to use for determining top-level roles.
 * @returns An AuthUser object.
 */
function mapUserDtoToAuthUser(user: UserDTO, primaryMembership: MembershipDTO): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
    accessRole: primaryMembership.accessRole,
    businessRole: primaryMembership.businessRole,
    memberships: user.memberships,
    // Note: activeOrgType logic could be implemented here if needed.
    activeOrgType: undefined,
  };
}

/**
 * Validates if a user's membership is active.
 * @param membership - The camelCase membership DTO to validate.
 */
function validateMembership(membership: MembershipDTO | undefined | null) {
  if (!membership || membership.status !== MembershipStatus.ACTIVE) {
    throw new AuthenticationError('No active membership found for this user.');
  }
}

// =================================================================
// SERVICE FUNCTIONS
// =================================================================

export async function registerAndCreateOrgService(
  organizationName: string,
  userName: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const existingUser = await getUserByEmail(email.toLowerCase());
  if (existingUser) {
    throw new AuthenticationError('User with this email already exists.');
  }

  const hashedPassword = await hashPassword(password);

  const { user, organization, membership } = await createOrganizationWithOwner({
    userName,
    userEmail: email.toLowerCase(),
    hashedPassword,
    orgName: organizationName,
    orgType: PROJECT_ORG_TYPES.BODYSHOP,
  });

  if (!user || !membership) {
    throw new AuthenticationError('Failed to create user and organization.');
  }

  const authUser = mapUserDtoToAuthUser(user, membership);
  const token = signToken(authUser);

  return { token, user: authUser, organization, membership };
}

export async function loginWorkerService(email: string, password: string): Promise<AuthResponse> {
  const user = await getUserByEmail(email.toLowerCase());
  if (!user || !user.password) {
    throw new UserNotFoundError();
  }

  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw new UserNotFoundError();
  }

  const primaryMembership = user.memberships[0];
  validateMembership(primaryMembership);

  const authUser = mapUserDtoToAuthUser(user, primaryMembership);
  const token = signToken(authUser);

  return { token, user: authUser, membership: primaryMembership };
}

export async function loginTerminalService(
  authMethod: AuthMethod,
  authValue: string
): Promise<AuthResponse> {
  const user = await getUserByTerminalAuth(authMethod, authValue);
  if (!user) {
    throw new UserNotFoundError('Invalid credentials or user not found.');
  }

  if (!user.isActive) {
    throw new AuthenticationError('User account is disabled.');
  }

  const primaryMembership = user.memberships[0];
  validateMembership(primaryMembership);

  const authUser = mapUserDtoToAuthUser(user, primaryMembership);
  const token = signToken(authUser);

  return { token, user: authUser, membership: primaryMembership };
}