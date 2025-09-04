// File: back/src/services/organization.service.ts
// Last change: Final consolidation of all organization and membership management logic.

import {
  get_membership_by_user_and_org,
  create_invite,
  get_membership_by_id,
  update_membership_status,
  delete_membership,
  update_membership_role,
  count_owners_in_org,
  create_membership,
  get_invite_by_token,
  delete_invite,
} from '../utils/bridge-organization.utils';
import { AccessRole } from 'common/types/access-role.types';
import { MembershipStatus } from 'common/types/auth backup.types';
import { generate_invite_token } from '../utils/organization-token.utils';

// ==================================================
// HELPER FUNCTIONS (Internal to this service)
// ==================================================

/**
 * Asserts that a user has the required permissions within an organization.
 * Throws an error if permissions are insufficient.
 * @param user_id - The ID of the user performing the action.
 * @param org_id - The ID of the target organization.
 * @param allowed_roles - An array of roles that are permitted to perform the action.
 * @returns The membership object of the user if permission is granted.
 */
async function assert_org_permission(
  user_id: string,
  org_id: string,
  allowed_roles: AccessRole[] = [AccessRole.Owner, AccessRole.Manager]
) {
  const membership = await get_membership_by_user_and_org(user_id, org_id);
  if (
    !membership ||
    !allowed_roles.includes(membership.role) ||
    membership.status !== MembershipStatus.Active
  ) {
    throw new Error('Forbidden: Insufficient permissions');
  }
  return membership;
}

/**
 * Ensures that an action will not leave an organization without an owner.
 * Throws an error if the organization has only one owner.
 * @param org_id - The ID of the organization to check.
 */
async function ensure_multiple_owners(org_id: string) {
  const owners_count = await count_owners_in_org(org_id);
  if (owners_count <= 1) {
    throw new Error('Forbidden: Cannot remove or demote the last Owner of the organization');
  }
}

// ==================================================
// USER-INITIATED ACTIONS (Joining/Leaving)
// ==================================================

/**
 * Allows a user to request to join an organization.
 * @param user_id - The ID of the user making the request.
 * @param organization_id - The ID of the organization to join.
 */
export async function request_to_join_organization_service(
  user_id: string,
  organization_id: string
) {
  const existing = await get_membership_by_user_and_org(user_id, organization_id);
  if (existing) {
    throw new Error('A membership or pending request already exists.');
  }

  const membership = await create_membership({
    user_id,
    organization_id,
    access_role: AccessRole.Worker,
    status: MembershipStatus.Pending,
  });

  return { success: true, membership };
}

/**
 * Allows a user to accept an invitation to join an organization.
 * @param user_id - The ID of the user accepting the invite.
 * @param invite_token - The unique invitation token.
 */
export async function accept_invite_service(user_id: string, invite_token: string) {
  const invite = await get_invite_by_token(invite_token);

  if (!invite || invite.expires_at < new Date()) {
    throw new Error('Invalid or expired invite token');
  }

  const existing = await get_membership_by_user_and_org(user_id, invite.organization_id);
  if (existing) {
    throw new Error('User is already a member of this organization');
  }

  const membership = await create_membership({
    user_id,
    organization_id: invite.organization_id,
    access_role: invite.access_role,
    status: MembershipStatus.Active,
  });

  await delete_invite(invite.id);
  return { success: true, membership };
}

/**
 * Allows a user to leave an organization.
 * @param user_id - The ID of the user leaving.
 * @param organization_id - The ID of the organization to leave.
 */
export async function leave_organization_service(user_id: string, organization_id: string) {
  const membership = await get_membership_by_user_and_org(user_id, organization_id);
  if (!membership) {
    throw new Error('Membership not found');
  }

  if (membership.role === AccessRole.Owner) {
    await ensure_multiple_owners(organization_id);
  }

  await delete_membership(user_id, organization_id);
  return { success: true, removed_user_id: user_id };
}


// ==================================================
// ADMIN/MANAGER ACTIONS (Management)
// ==================================================

/**
 * Invites a new user to the organization by email.
 * @param actor_user_id - The ID of the admin/manager sending the invite.
 * @param org_id - The ID of the organization.
 * @param email - The email of the user to invite.
 * @param role - The role to assign to the invited user.
 */
export async function invite_user_by_email_service(
  actor_user_id: string,
  org_id: string,
  email: string,
  role: AccessRole
) {
  await assert_org_permission(actor_user_id, org_id);
  const token = generate_invite_token();
  const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const invite = await create_invite({
    organization_id: org_id,
    email: email.toLowerCase(),
    access_role: role,
    token,
    expires_at,
  });

  return { success: true, invite };
}

/**
 * Approves a pending membership request.
 * @param approver_user_id - The ID of the admin/manager approving the request.
 * @param request_id - The ID of the membership request to approve.
 */
export async function approve_membership_request_service(
  approver_user_id: string,
  request_id: string
) {
  const membership_request = await get_membership_by_id(request_id);
  if (!membership_request || membership_request.status !== MembershipStatus.Pending) {
    throw new Error('Request not found or has already been processed');
  }

  await assert_org_permission(approver_user_id, membership_request.organization_id);

  const approved_membership = await update_membership_status(
    request_id,
    MembershipStatus.Active
  );

  return { success: true, membership: approved_membership };
}

/**
 * Removes a member from an organization.
 * @param remover_user_id - The ID of the admin/manager removing the member.
 * @param org_id - The ID of the organization.
 * @param target_user_id - The ID of the user to be removed.
 */
export async function remove_member_from_org_service(
  remover_user_id: string,
  org_id: string,
  target_user_id: string
) {
  const remover_membership = await assert_org_permission(remover_user_id, org_id);

  const target_membership = await get_membership_by_user_and_org(target_user_id, org_id);
  if (target_membership?.role === AccessRole.Owner) {
    await ensure_multiple_owners(org_id);
  }

  await delete_membership(target_user_id, org_id);
  return { success: true, removed_user_id: target_user_id };
}

/**
 * Changes the role of a member within an organization.
 * @param changer_user_id - The ID of the admin/manager changing the role.
 * @param org_id - The ID of the organization.
 * @param target_user_id - The ID of the user whose role is being changed.
 * @param new_role - The new role to assign.
 */
export async function change_member_role_service(
  changer_user_id: string,
  org_id: string,
  target_user_id: string,
  new_role: AccessRole
) {
  const changer_membership = await assert_org_permission(changer_user_id, org_id);
  const target_membership = await get_membership_by_user_and_org(target_user_id, org_id);

  if (!target_membership) {
    throw new Error('Target user is not a member of this organization.');
  }

  if (new_role === AccessRole.Owner && changer_membership.role !== AccessRole.Owner) {
    throw new Error('Forbidden: Only Owners can promote other users to the Owner role');
  }

  if (target_membership.role === AccessRole.Owner && new_role !== AccessRole.Owner) {
    await ensure_multiple_owners(org_id);
  }

  const updated_membership = await update_membership_role(
    target_user_id,
    org_id,
    new_role
  );

  return { success: true, membership: updated_membership };
}

