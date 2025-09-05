// File: back/src/services/user.service.ts
// Last change: Refactored to align with SSoT and Bridge Layer conventions.

import jwt from 'jsonwebtoken';
import { hashPassword } from '../utils/auth-crypto.utils';
import { signToken } from '../utils/auth-jwt.utils';
import {
  get_user_by_email,
  get_all_users_from_db,
  get_user_by_id_from_db,
  create_user,
  update_user_in_db,
} from '../utils/bridge-user.utils';
import {
  get_membership_by_user_and_org,
  create_membership,
} from '../utils/bridge-organization.utils';
import {
  ACCESS_ROLES,
  MEMBERSHIP_STATUSES,
} from 'common/configs/01-constants.config';
import type {
  AccessRole,
  MembershipStatus,
  AuthUser,
  AuthMembership,
  BusinessRole,
} from 'common/types/project.types';

// =================================================================
// HELPER TYPES & MAPPERS
// =================================================================

// Helper types for snake_case data from the bridge layer.
type BridgeMembership = {
  id: string;
  user_id: string;
  organization_id: string;
  access_role: AccessRole;
  business_role: BusinessRole | null;
  status: MembershipStatus;
};

type BridgeUser = {
  id: string;
  name: string;
  email: string;
  password: string | null;
  is_verified: boolean;
  is_active: boolean;
  memberships: BridgeMembership[];
};

/**
 * Maps a snake_case bridge user object to a camelCase AuthUser object.
 */
function mapBridgeUserToAuthUser(user: BridgeUser): AuthUser {
  const primaryMembership = user.memberships[0] || {};
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isVerified: user.is_verified,
    accessRole: primaryMembership.access_role || ACCESS_ROLES.WORKER, // Default role if no membership
    businessRole: primaryMembership.business_role || null,
    memberships: user.memberships.map((m) => ({
      organizationId: m.organization_id,
      role: m.access_role,
      businessRole: m.business_role,
      status: m.status,
    })),
  };
}

// =================================================================
// DTOs (Data Transfer Objects) for service inputs
// =================================================================

interface RegisterIndividualUserData {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  isActive?: boolean;
}

interface DecodedPasswordLinkToken {
  userId: string;
  purpose: 'link-password';
  iat: number;
  exp: number;
}

// =================================================================
// SERVICE FUNCTIONS
// =================================================================

/**
 * Registers a new individual user without an organization.
 */
export async function registerIndividualUserService(
  data: RegisterIndividualUserData
) {
  const { name, email, password } = data;

  const existingUser = await get_user_by_email(email.toLowerCase());
  if (existingUser) {
    throw new Error('User with this email already exists.');
  }

  const hashedPassword = await hashPassword(password);

  const newUser = (await create_user({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
  })) as BridgeUser;

  return mapBridgeUserToAuthUser(newUser);
}

/**
 * Allows a user to request to join an organization.
 */
export async function requestToJoinOrganizationService(
  userId: string,
  organizationId: string
) {
  const existing = (await get_membership_by_user_and_org(
    userId,
    organizationId
  )) as BridgeMembership | null;

  if (existing) {
    if (existing.status === MEMBERSHIP_STATUSES.PENDING) {
      throw new Error('A membership request is already pending.');
    }
    throw new Error('User is already a member of this organization.');
  }

  const membership = (await create_membership({
    user_id: userId,
    organization_id: organizationId,
    access_role: ACCESS_ROLES.WORKER,
    status: MEMBERSHIP_STATUSES.PENDING,
  })) as BridgeMembership;

  return {
    organizationId: membership.organization_id,
    role: membership.access_role,
    businessRole: membership.business_role,
    status: membership.status,
  } as AuthMembership;
}

/**
 * Generates and logs a password link for a user.
 */
export async function requestPasswordLinkService(email: string) {
  const user = (await get_user_by_email(
    email.toLowerCase()
  )) as BridgeUser | null;

  if (!user) {
    console.warn(
      `[USER_SERVICE] Password link requested for non-existent user: ${email}`
    );
    return; // Fail silently
  }

  const linkToken = jwt.sign(
    { userId: user.id, purpose: 'link-password' },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );

  const verificationUrl = `${process.env.FRONTEND_URL}/link-password?token=${linkToken}`;
  console.log(`[DEV] Password link URL for ${user.email}: ${verificationUrl}`);
}

/**
 * Completes the password linking process using a token.
 */
export async function completePasswordLinkService(token: string, password: string) {
  let decoded: DecodedPasswordLinkToken;
  try {
    decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as DecodedPasswordLinkToken;
  } catch (error) {
    throw new Error('Invalid or expired token.');
  }

  if (decoded.purpose !== 'link-password') {
    throw new Error('Invalid token purpose.');
  }

  const hashedPassword = await hashPassword(password);

  const updatedUser = (await update_user_in_db(decoded.userId, {
    password: hashedPassword,
  })) as BridgeUser;

  const authUser = mapBridgeUserToAuthUser(updatedUser);
  const authToken = signToken(authUser);

  return { token: authToken, user: authUser };
}

/**
 * Retrieves a list of all users.
 */
export async function getAllUsersService() {
  const users = (await get_all_users_from_db()) as BridgeUser[];
  return users.map(mapBridgeUserToAuthUser);
}

/**
 * Retrieves a single user by their ID.
 */
export async function getUserByIdService(id: string) {
  const user = (await get_user_by_id_from_db(id)) as BridgeUser | null;
  return user ? mapBridgeUserToAuthUser(user) : null;
}

/**
 * Updates a user's core information.
 */
export async function updateUserService(id: string, data: UpdateUserData) {
  const updatedUser = (await update_user_in_db(id, {
    name: data.name,
    email: data.email,
    is_active: data.isActive,
  })) as BridgeUser;

  return mapBridgeUserToAuthUser(updatedUser);
}
