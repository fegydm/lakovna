// File: back/src/services/auth.service.ts
// Last change: Refactored with shared types and centralized AuthUser builder

import { 
  get_user_by_email, 
  create_user_and_organization, 
  get_user_by_terminal_auth 
} from '../utils/user.utils';
import { hash_password, verify_password } from '../auth/crypto.utils';
import { sign_token } from '../auth/jwt.utils';
import { AccessRole } from 'common/types/access-role.types';
import { MembershipStatus, AuthUser } from 'common/types/auth.types';
import { PROJECT_CONFIG } from 'common/configs/project.config';
import type { UserWithMemberships } from 'common/types/user.types';

// ==================================================
// HELPER: Build AuthUser from user and memberships
// ==================================================
function build_auth_user(user: UserWithMemberships): AuthUser {
  const primary = user.memberships[0];

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    is_verified: user.is_verified,
    access_role: primary?.role,
    business_role: primary?.business_role ?? undefined,
    memberships: user.memberships.map(m => ({
      organization_id: m.organization_id,
      role: m.role,
      business_role: m.business_role ?? undefined,
    })),
  };
}

// ==================================================
// REGISTER + CREATE ORG
// ==================================================
export async function register_and_create_org_service(
  organization_name: string,
  user_name: string,
  email: string,
  password: string
) {
  const existing_user = await get_user_by_email(email.toLowerCase());
  if (existing_user) throw new Error('User with this email already exists');

  const hashed_password = await hash_password(password);

  const { user, organization, membership } = await create_user_and_organization(
    user_name,
    email.toLowerCase(),
    hashed_password,
    organization_name,
    PROJECT_CONFIG.organization_type_mappings.bodyshop.key,
    AccessRole.OWNER,
    'shop_owner'
  );

  const auth_user = build_auth_user({
    ...user,
    is_active: user.is_active,
    memberships: [{
      organization_id: membership.organization_id,
      role: membership.access_role,
      business_role: membership.business_role,
      status: membership.status
    }]
  });

  const token = sign_token(auth_user);

  return { token, user, organization, membership };
}

// ==================================================
// LOGIN (EMAIL + PASSWORD)
// ==================================================
export async function login_worker_service(email: string, password: string) {
  const user = await get_user_by_email(email.toLowerCase()) as UserWithMemberships | null;
  if (!user || !user.password) throw new Error('Invalid credentials');
  if (!user.is_active) throw new Error('User account is disabled');

  const is_password_valid = await verify_password(password, user.password);
  if (!is_password_valid) throw new Error('Invalid credentials');
  
  const primary_membership = user.memberships[0];
  if (!primary_membership || primary_membership.status !== MembershipStatus.ACTIVE) {
    throw new Error('No active membership found for this user');
  }

  const auth_user = build_auth_user(user);
  const token = sign_token(auth_user);

  return { token, user, membership: primary_membership };
}

// ==================================================
// LOGIN (TERMINAL AUTH: RFID / QR / USB)
// ==================================================
export async function login_terminal_service(
  auth_method: 'rfid' | 'qr' | 'usb',
  auth_value: string
) {
  const user = await get_user_by_terminal_auth(auth_method, auth_value) as UserWithMemberships | null;
  
  if (!user) throw new Error('Invalid credentials or user not found');
  if (!user.is_active) throw new Error('User account is disabled');

  const primary_membership = user.memberships[0];
  if (!primary_membership || primary_membership.status !== MembershipStatus.ACTIVE) {
    throw new Error('No active membership found for this user');
  }

  const auth_user = build_auth_user(user);
  const token = sign_token(auth_user);

  return { token, user, membership: primary_membership };
}
