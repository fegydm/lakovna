// File: back/src/services/user.service.ts
// Last change: Consolidated all user-related services and fully decoupled from Prisma.

import jwt from 'jsonwebtoken';
import { hash_password } from '../utils/auth-crypto.utils';
import { sign_token } from '../utils/auth-jwt.utils';
import { AccessRole } from 'common/types/access-role.types';
import { MembershipStatus } from 'common/types/auth backup.types';
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
  create_organization_with_owner,
} from '../utils/bridge-organization.utils';

// --- Input Data Interfaces (DTOs - Data Transfer Objects) ---

interface RegisterIndividualUserData {
  name: string;
  email: string;
  password: string;
}

interface RegisterOrganizationData {
  user_name: string;
  user_email: string;
  user_password: string;
  org_name: string;
  org_type: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  is_active?: boolean;
  // Note: 'role' and 'rfid_tag' are part of the Membership model.
  // Updating them would require a separate service function that calls
  // the organization bridge.
}

interface DecodedPasswordLinkToken {
  user_id: string;
  purpose: 'link-password';
  iat: number;
  exp: number;
}

// ==================================================
// REGISTRATION AND ONBOARDING
// ==================================================

/**
 * Registers a new individual user.
 * @param data - Object containing the user's name, email, and password.
 * @returns The created user object.
 */
export const register_individual_user_service = async (data: RegisterIndividualUserData) => {
  const { name, email, password } = data;

  const existing_user = await get_user_by_email(email);
  if (existing_user) {
    throw new Error('USER_ALREADY_EXISTS');
  }

  const hashed_password = await hash_password(password);

  // The bridge function `create_user` expects a simple object.
  const new_user = await create_user({
    name,
    email,
    password: hashed_password,
  });

  return new_user;
};

/**
 * Registers a new organization and its owner.
 * @param data - Object containing user and organization details.
 * @returns An object with the created user, organization, and membership.
 */
export const register_organization_and_owner_service = async (data: RegisterOrganizationData) => {
  const { user_name, user_email, user_password, org_name, org_type } = data;

  const existing_user = await get_user_by_email(user_email);
  if (existing_user) {
    throw new Error('USER_ALREADY_EXISTS');
  }

  const hashed_password = await hash_password(user_password);

  return create_organization_with_owner({
    user_name,
    user_email,
    hashed_password,
    org_name,
    org_type,
  });
};

/**
 * Allows a logged-in user to request to join an existing organization.
 * @param user_id - The ID of the user requesting to join.
 * @param organization_id - The ID of the target organization.
 * @returns The created membership object with a "pending" status.
 */
export const request_to_join_organization_service = async (
  user_id: string,
  organization_id: string
) => {
  const existing_membership = await get_membership_by_user_and_org(user_id, organization_id);
  if (existing_membership) {
    if (existing_membership.status === MembershipStatus.Pending) {
      throw new Error('REQUEST_ALREADY_PENDING');
    }
    throw new Error('ALREADY_A_MEMBER');
  }

  return create_membership({
    user_id,
    organization_id,
    access_role: AccessRole.Worker,
    status: MembershipStatus.Pending,
  });
};


// ==================================================
// USER MANAGEMENT AND CRUD
// ==================================================

/**
 * Handles the logic for requesting a password link for a user.
 * @param email - The email of the user requesting the link.
 */
export const request_password_link_service = async (email: string) => {
  const user = await get_user_by_email(email.toLowerCase());

  if (!user) {
    console.warn(`[USER_SERVICE] Password link requested for non-existent user: ${email}`);
    return;
  }

  const link_token = jwt.sign(
    { user_id: user.id, purpose: 'link-password' },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );

  const verification_url = `${process.env.FRONTEND_URL}/link-password?token=${link_token}`;
  console.log(`[DEV] Password link URL for ${user.email}: ${verification_url}`);
};

/**
 * Completes the password linking process.
 * @param token - The JWT from the password link.
 * @param password - The new password to set.
 * @returns An object containing the new auth token and the updated user.
 */
export const complete_password_link_service = async (token: string, password: string) => {
  let decoded: DecodedPasswordLinkToken;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedPasswordLinkToken;
  } catch (error) {
    throw new Error('Invalid or expired token.');
  }

  if (decoded.purpose !== 'link-password') {
    throw new Error('Invalid token purpose.');
  }

  const hashed_password = await hash_password(password);

  const updated_user = await update_user_in_db(decoded.user_id, {
    password: hashed_password,
  });

  const auth_token = sign_token(updated_user);
  return { token: auth_token, user: updated_user };
};

/**
 * Retrieves a list of all users.
 * @returns An array of user objects.
 */
export const get_all_users_service = () => {
  return get_all_users_from_db();
};

/**
 * Retrieves a single user by their ID.
 * @param id - The ID of the user to retrieve.
 * @returns The user object or null if not found.
 */
export const get_user_by_id_service = (id: string) => {
  return get_user_by_id_from_db(id);
};

/**
 * Updates a user's core information.
 * @param id - The ID of the user to update.
 * @param data - An object with the user data to update.
 * @returns The updated user object.
 */
export const update_user_service = (id: string, data: UpdateUserData) => {
  // This function now passes a clean, Prisma-independent object to the bridge.
  const update_data = {
    name: data.name,
    email: data.email,
    is_active: data.is_active,
  };

  return update_user_in_db(id, update_data);
};

