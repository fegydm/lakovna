// File: back/src/services/auth.service.ts
// Last change: Fixed type inconsistencies and aligned with Bridge Layer Architecture

import {
  get_user_by_email,
  get_user_by_terminal_auth,
} from '../utils/bridge-user.utils';
import { create_organization_with_owner } from '../utils/bridge-organization.utils';
import { hashPassword, verifyPassword } from '../utils/auth-crypto.utils';
import { signToken } from '../utils/auth-jwt.utils';
import {
  PROJECT_ORG_TYPES,
  MEMBERSHIP_STATUSES,
} from 'common/configs/01-constants.config';

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

interface BridgeMembership {
  id: string;
  user_id: string;
  organization_id: string;
  access_role: string;
  business_role: string | null;
  status: string;
  auth_methods: string[];
  rfid_tag: string | null;
  qr_code: string | null;
  usb_key_id: string | null;
  created_at: Date;
  updated_at: Date;
}

interface BridgeUser {
  id: string;
  name: string;
  email: string;
  password: string | null;
  is_verified: boolean;
  is_active: boolean;
  memberships: BridgeMembership[];
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  accessRole: string;
  businessRole: string | null;
  memberships: Array<{
    organizationId: string;
    role: string;
    businessRole: string | null;
    status: string;
  }>;
}

interface UserWithMemberships {
  id: string;
  name: string;
  email: string;
  password: string | null;
  isVerified: boolean;
  isActive: boolean;
  memberships: Array<{
    organizationId: string;
    role: string;
    businessRole: string | null;
    status: string;
  }>;
}

function mapBridgeUserToAuthUser(
  user: BridgeUser,
  primaryMembership: BridgeMembership
): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isVerified: user.is_verified,
    accessRole: primaryMembership.access_role,
    businessRole: primaryMembership.business_role,
    memberships: user.memberships.map((m) => ({
      organizationId: m.organization_id,
      role: m.access_role,
      businessRole: m.business_role,
      status: m.status,
    })),
  };
}

function validateMembership(membership: BridgeMembership | undefined | null) {
  if (!membership || membership.status !== MEMBERSHIP_STATUSES.ACTIVE) {
    throw new AuthenticationError('No active membership found for this user.');
  }
}

export async function registerAndCreateOrgService(
  organizationName: string,
  userName: string,
  email: string,
  password: string
) {
  const existingUser = await get_user_by_email(email.toLowerCase());
  if (existingUser) {
    throw new AuthenticationError('User with this email already exists.');
  }

  const hashedPassword = await hashPassword(password);

  const result = await create_organization_with_owner({
    user_name: userName,
    user_email: email.toLowerCase(),
    hashed_password: hashedPassword,
    org_name: organizationName,
    org_type: PROJECT_ORG_TYPES.BODYSHOP,
  });

  if (!result.user || !result.membership) {
    throw new AuthenticationError('Failed to create user and organization.');
  }

  const userForToken: UserWithMemberships = {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
    isVerified: result.user.is_verified,
    isActive: result.user.is_active,
    password: result.user.password,
    memberships: [{
      organizationId: result.membership.organization_id,
      role: result.membership.access_role,
      businessRole: result.membership.business_role,
      status: result.membership.status,
    }],
  };

  const token = signToken(userForToken);
  
  const bridgeUserWithMemberships: BridgeUser = {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
    password: result.user.password,
    is_verified: result.user.is_verified,
    is_active: result.user.is_active,
    memberships: [result.membership],
  };

  const authUser: AuthUser = mapBridgeUserToAuthUser(bridgeUserWithMemberships, result.membership);

  return { 
    token, 
    user: authUser, 
    organization: result.organization, 
    membership: result.membership 
  };
}

export async function loginWorkerService(email: string, password: string) {
  const user = await get_user_by_email(email.toLowerCase());
  if (!user || !user.password) {
    throw new UserNotFoundError();
  }

  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw new UserNotFoundError();
  }

  const primaryMembership = user.memberships[0];
  validateMembership(primaryMembership);

  const userForToken: UserWithMemberships = {
    id: user.id,
    name: user.name,
    email: user.email,
    isVerified: user.is_verified,
    isActive: user.is_active,
    password: user.password,
    memberships: user.memberships.map((m) => ({
      organizationId: m.organization_id,
      role: m.access_role,
      businessRole: m.business_role,
      status: m.status,
    })),
  };

  const token = signToken(userForToken);
  const authUser: AuthUser = mapBridgeUserToAuthUser(user, primaryMembership);

  return { token, user: authUser, membership: primaryMembership };
}

export async function loginTerminalService(
  authMethod: 'rfid' | 'qr' | 'usb',
  authValue: string
) {
  const user = await get_user_by_terminal_auth(authMethod, authValue);
  if (!user) {
    throw new UserNotFoundError('Invalid credentials or user not found.');
  }

  if (!user.is_active) {
    throw new AuthenticationError('User account is disabled.');
  }

  const primaryMembership = user.memberships[0];
  validateMembership(primaryMembership);

  const userForToken: UserWithMemberships = {
    id: user.id,
    name: user.name,
    email: user.email,
    isVerified: user.is_verified,
    isActive: user.is_active,
    password: user.password,
    memberships: user.memberships.map((m) => ({
      organizationId: m.organization_id,
      role: m.access_role,
      businessRole: m.business_role,
      status: m.status,
    })),
  };

  const token = signToken(userForToken);
  const authUser: AuthUser = mapBridgeUserToAuthUser(user, primaryMembership);

  return { token, user: authUser, membership: primaryMembership };
}