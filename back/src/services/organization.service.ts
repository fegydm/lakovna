// File: back/src/services/organization.service.ts
// Last change: Refactored to align with SSoT and Bridge Layer conventions.

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
import { generateInviteToken } from '../utils/organization-token.utils';
import {
  ACCESS_ROLES,
  MEMBERSHIP_STATUSES,
} from 'common/configs/01-constants.config';
import type {
  AccessRole,
  MembershipStatus,
  AuthMembership,
  Invite,
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

type BridgeInvite = {
  id: string;
  organization_id: string;
  email: string;
  access_role: AccessRole;
  token: string;
  expires_at: Date;
};

/**
 * Maps a snake_case bridge membership object to a camelCase AuthMembership object.
 */
function mapBridgeToAuthMembership(
  bridgeMembership: BridgeMembership
): AuthMembership {
  return {
    organizationId: bridgeMembership.organization_id,
    role: bridgeMembership.access_role,
    businessRole: bridgeMembership.business_role,
    status: bridgeMembership.status,
  };
}

/**
 * Maps a snake_case bridge invite object to a camelCase Invite object.
 */
function mapBridgeToInvite(bridgeInvite: BridgeInvite): Invite {
  return {
    id: bridgeInvite.id,
    organizationId: bridgeInvite.organization_id,
    email: bridgeInvite.email,
    accessRole: bridgeInvite.access_role,
    token: bridgeInvite.token,
    expiresAt: bridgeInvite.expires_at,
  };
}

// =================================================================
// INTERNAL HELPER FUNCTIONS
// =================================================================

/**
 * Asserts that a user has the required permissions within an organization.
 */
async function assertOrgPermission(
  userId: string,
  orgId: string,
  allowedRoles: AccessRole[] = [ACCESS_ROLES.OWNER, ACCESS_ROLES.MANAGER]
): Promise<BridgeMembership> {
  const membership = (await get_membership_by_user_and_org(
    userId,
    orgId
  )) as BridgeMembership | null;

  if (
    !membership ||
    !allowedRoles.includes(membership.access_role) ||
    membership.status !== MEMBERSHIP_STATUSES.ACTIVE
  ) {
    throw new Error('Forbidden: Insufficient permissions');
  }
  return membership;
}

/**
 * Ensures that an action will not leave an organization without an owner.
 */
async function ensureMultipleOwners(orgId: string) {
  const ownersCount = await count_owners_in_org(orgId);
  if (ownersCount <= 1) {
    throw new Error(
      'Forbidden: Cannot remove or demote the last Owner of the organization'
    );
  }
}

// =================================================================
// USER-INITIATED ACTIONS (Joining/Leaving)
// =================================================================

/**
 * Allows a user to request to join an organization.
 */
export async function requestToJoinOrganizationService(
  userId: string,
  organizationId: string
) {
  const existing = await get_membership_by_user_and_org(userId, organizationId);
  if (existing) {
    throw new Error('A membership or pending request already exists.');
  }

  const membership = (await create_membership({
    user_id: userId,
    organization_id: organizationId,
    access_role: ACCESS_ROLES.WORKER,
    status: MEMBERSHIP_STATUSES.PENDING,
  })) as BridgeMembership;

  return {
    success: true,
    membership: mapBridgeToAuthMembership(membership),
  };
}

/**
 * Allows a user to accept an invitation to join an organization.
 */
export async function acceptInviteService(userId: string, inviteToken: string) {
  const invite = (await get_invite_by_token(inviteToken)) as BridgeInvite | null;

  if (!invite || invite.expires_at < new Date()) {
    throw new Error('Invalid or expired invite token');
  }

  const existing = await get_membership_by_user_and_org(
    userId,
    invite.organization_id
  );
  if (existing) {
    throw new Error('User is already a member of this organization');
  }

  const membership = (await create_membership({
    user_id: userId,
    organization_id: invite.organization_id,
    access_role: invite.access_role,
    status: MEMBERSHIP_STATUSES.ACTIVE,
  })) as BridgeMembership;

  await delete_invite(invite.id);
  return {
    success: true,
    membership: mapBridgeToAuthMembership(membership),
  };
}

/**
 * Allows a user to leave an organization.
 */
export async function leaveOrganizationService(
  userId: string,
  organizationId: string
) {
  const membership = (await get_membership_by_user_and_org(
    userId,
    organizationId
  )) as BridgeMembership | null;

  if (!membership) {
    throw new Error('Membership not found');
  }

  if (membership.access_role === ACCESS_ROLES.OWNER) {
    await ensureMultipleOwners(organizationId);
  }

  await delete_membership(userId, organizationId);
  return { success: true, removedUserId: userId };
}

// =================================================================
// ADMIN/MANAGER ACTIONS (Management)
// =================================================================

/**
 * Invites a new user to the organization by email.
 */
export async function inviteUserByEmailService(
  actorUserId: string,
  orgId: string,
  email: string,
  role: AccessRole
) {
  await assertOrgPermission(actorUserId, orgId);
  const token = generateInviteToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const invite = (await create_invite({
    organization_id: orgId,
    email: email.toLowerCase(),
    access_role: role,
    token,
    expires_at: expiresAt,
  })) as BridgeInvite;

  return { success: true, invite: mapBridgeToInvite(invite) };
}

/**
 * Approves a pending membership request.
 */
export async function approveMembershipRequestService(
  approverUserId: string,
  requestId: string
) {
  const membershipRequest = (await get_membership_by_id(
    requestId
  )) as BridgeMembership | null;

  if (
    !membershipRequest ||
    membershipRequest.status !== MEMBERSHIP_STATUSES.PENDING
  ) {
    throw new Error('Request not found or has already been processed');
  }

  await assertOrgPermission(approverUserId, membershipRequest.organization_id);

  const approvedMembership = (await update_membership_status(
    requestId,
    MEMBERSHIP_STATUSES.ACTIVE
  )) as BridgeMembership;

  return {
    success: true,
    membership: mapBridgeToAuthMembership(approvedMembership),
  };
}

/**
 * Removes a member from an organization.
 */
export async function removeMemberFromOrgService(
  removerUserId: string,
  orgId: string,
  targetUserId: string
) {
  await assertOrgPermission(removerUserId, orgId);

  const targetMembership = (await get_membership_by_user_and_org(
    targetUserId,
    orgId
  )) as BridgeMembership | null;

  if (targetMembership?.access_role === ACCESS_ROLES.OWNER) {
    await ensureMultipleOwners(orgId);
  }

  await delete_membership(targetUserId, orgId);
  return { success: true, removedUserId: targetUserId };
}

/**
 * Changes the role of a member within an organization.
 */
export async function changeMemberRoleService(
  changerUserId: string,
  orgId: string,
  targetUserId: string,
  newRole: AccessRole
) {
  const changerMembership = await assertOrgPermission(changerUserId, orgId);
  const targetMembership = (await get_membership_by_user_and_org(
    targetUserId,
    orgId
  )) as BridgeMembership | null;

  if (!targetMembership) {
    throw new Error('Target user is not a member of this organization.');
  }

  if (
    newRole === ACCESS_ROLES.OWNER &&
    changerMembership.access_role !== ACCESS_ROLES.OWNER
  ) {
    throw new Error(
      'Forbidden: Only Owners can promote other users to the Owner role'
    );
  }

  if (
    targetMembership.access_role === ACCESS_ROLES.OWNER &&
    newRole !== ACCESS_ROLES.OWNER
  ) {
    await ensureMultipleOwners(orgId);
  }

  const updatedMembership = (await update_membership_role(
    targetUserId,
    orgId,
    newRole
  )) as BridgeMembership;

  return {
    success: true,
    membership: mapBridgeToAuthMembership(updatedMembership),
  };
}
