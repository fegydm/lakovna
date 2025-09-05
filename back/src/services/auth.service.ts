// File: back/src/services/auth.service.ts
// Last change: Hardened types & guards, DTO‑only logic, membership‑based checks, no Prisma enums, SSoT‑aligned

// 1) Domain utils (bridge + crypto + jwt)
import { getUserByEmail, getUserByTerminalAuth } from '../utils/bridge-user.utils';
import { createOrganizationWithOwner } from '../utils/bridge-organization.utils';
import { hashPassword, verifyPassword } from '../utils/auth-crypto.utils';
import { signToken } from '../utils/auth-jwt.utils';
import { PROJECT_ORG_TYPES } from 'common/configs/01-constants.config';

// 2) Types last (SSoT derived)
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
// TYPE GUARDS & HELPERS
// =================================================================
/** Narrow user to one that includes a password hash, if present. */
function hasPassword(u: unknown): u is UserDTO & { password: string } {
  return !!u && typeof (u as any).password === 'string' && (u as any).password.length > 0;
}

/** Ensure we have a membership list. */
function hasMemberships(u: UserDTO | any): u is UserDTO & { memberships: MembershipDTO[] } {
  return !!u && Array.isArray((u as any).memberships);
}

/** Pick a primary membership: prefer ACTIVE, fallback to first. */
function pickPrimaryMembership(memberships: MembershipDTO[] | undefined | null): MembershipDTO {
  if (!memberships || memberships.length === 0) {
    throw new AuthenticationError('No memberships found for this user.');
  }
  const active = memberships.find((m) => (m as any).status === 'ACTIVE');
  return active ?? memberships[0];
}

/** Map DTO → AuthUser for token payload and FE usage. */
function mapUserDtoToAuthUser(user: UserDTO, primaryMembership: MembershipDTO): AuthUser {
  // Note: field names follow camelCase. Bridge layer guarantees camelCase DTOs.
  return {
    id: (user as any).id,
    name: (user as any).name,
    email: (user as any).email,
    isVerified: Boolean((user as any).isVerified),
    accessRole: (primaryMembership as any).accessRole,
    businessRole: (primaryMembership as any).businessRole,
    memberships: (user as any).memberships ?? [],
    // If project defines orgType on membership, use it; otherwise undefined
    activeOrgType: (primaryMembership as any).orgType ?? undefined,
  } as AuthUser;
}

// =================================================================
// MEMBERSHIP VALIDATION
// =================================================================
function validateMembership(membership: MembershipDTO | undefined | null) {
  if (!membership) {
    throw new AuthenticationError('No active membership found for this user.');
  }
  // Compare to SSoT string union (config‑derived), not Prisma enum
  const status = (membership as any).status;
  if (status !== 'ACTIVE') {
    throw new AuthenticationError('No active membership found for this user.');
  }
}

// =================================================================
// SERVICES
// =================================================================
export async function registerAndCreateOrgService(
  organizationName: string,
  userName: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await getUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new AuthenticationError('User with this email already exists.');
  }

  const hashedPassword = await hashPassword(password);

  const { user, organization, membership } = await createOrganizationWithOwner({
    userName,
    userEmail: normalizedEmail,
    hashedPassword,
    orgName: organizationName,
    orgType: PROJECT_ORG_TYPES.BODYSHOP, // SSoT value; bridge maps to DB
  });

  if (!user || !membership) {
    throw new AuthenticationError('Failed to create user and organization.');
  }

  const primaryMembership = pickPrimaryMembership((user as any).memberships);
  validateMembership(primaryMembership);

  const authUser = mapUserDtoToAuthUser(user, primaryMembership);
  const token = signToken(authUser);

  return { token, user: authUser, organization, membership: primaryMembership } as AuthResponse;
}

export async function loginWorkerService(email: string, password: string): Promise<AuthResponse> {
  const normalizedEmail = email.toLowerCase().trim();

  const userBase = await getUserByEmail(normalizedEmail);
  if (!userBase || !hasPassword(userBase)) {
    // Either user does not exist or password hash not available via DTO
    throw new UserNotFoundError();
  }

  const isPasswordValid = await verifyPassword(password, userBase.password);
  if (!isPasswordValid) {
    throw new UserNotFoundError();
  }

  if (!hasMemberships(userBase)) {
    throw new AuthenticationError('No memberships found for this user.');
  }

  const primaryMembership = pickPrimaryMembership(userBase.memberships);
  validateMembership(primaryMembership);

  const authUser = mapUserDtoToAuthUser(userBase, primaryMembership);
  const token = signToken(authUser);

  return { token, user: authUser, membership: primaryMembership } as AuthResponse;
}

export async function loginTerminalService(
  authMethod: AuthMethod,
  authValue: string
): Promise<AuthResponse> {
  // Bridge resolves method/value, returns DTO (no password). Disabled accounts should be checked via membership.
  const user = await getUserByTerminalAuth(authMethod, authValue);
  if (!user) {
    throw new UserNotFoundError('Invalid credentials or user not found.');
  }

  if (!hasMemberships(user)) {
    throw new AuthenticationError('No memberships found for this user.');
  }

  const primaryMembership = pickPrimaryMembership(user.memberships);
  validateMembership(primaryMembership);

  const authUser = mapUserDtoToAuthUser(user, primaryMembership);
  const token = signToken(authUser);

  return { token, user: authUser, membership: primaryMembership } as AuthResponse;
}
