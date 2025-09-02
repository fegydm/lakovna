// File: back/src/services/organization.service.ts
// Last change: Removed direct Prisma import, using utils only

import { 
  get_membership_by_user_and_org, 
  create_invite, 
  get_membership_by_id, 
  update_membership_status, 
  delete_membership, 
  update_membership_role,
  count_owners_in_org
} from '../utils/organization.utils';
import { AccessRole } from 'common/types/access-role.types';
import { MembershipStatus } from 'common/types/auth.types';
import { generate_invite_token } from '../utils/token.utils';

// ==================================================
// HELPER: Assert user has required permissions
// ==================================================
async function assert_org_permission(
  user_id: string, 
  org_id: string, 
  allowed_roles: AccessRole[] = [AccessRole.OWNER, AccessRole.MANAGER]
) {
  const membership = await get_membership_by_user_and_org(user_id, org_id);
  if (
    !membership || 
    !allowed_roles.includes(membership.access_role) || 
    membership.status !== MembershipStatus.ACTIVE
  ) {
    throw new Error('Forbidden: insufficient permissions');
  }
  return membership;
}

// ==================================================
// HELPER: Ensure org has more than one owner
// ==================================================
async function ensure_multiple_owners(org_id: string) {
  const owners_count = await count_owners_in_org(org_id);
  if (owners_count <= 1) {
    throw new Error('Cannot remove or demote the last owner of the organization');
  }
}

// ==================================================
// INVITE WORKER BY EMAIL
// ==================================================
export async function invite_worker_by_email_service(
  owner_id: string, 
  org_id: string, 
  email: string, 
  role: AccessRole
) {
  await assert_org_permission(owner_id, org_id);

  const token = generate_invite_token();
  const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const invite = await create_invite({
    organization_id: org_id,
    email: email.toLowerCase(),
    access_role: role,
    token,
    expires_at
  });

  return { success: true, invite };
}

// ==================================================
// APPROVE MEMBERSHIP REQUEST
// ==================================================
export async function approve_membership_request_service(
  approver_id: string, 
  request_id: string
) {
  const membership_request = await get_membership_by_id(request_id);
  if (!membership_request || membership_request.status !== MembershipStatus.PENDING) {
    throw new Error('Request not found or already processed');
  }

  await assert_org_permission(approver_id, membership_request.organization_id);

  const approved_membership = await update_membership_status(
    request_id, 
    MembershipStatus.ACTIVE
  );

  return { success: true, membership: approved_membership };
}

// ==================================================
// REMOVE WORKER FROM ORGANIZATION
// ==================================================
export async function remove_worker_from_org_service(
  remover_id: string, 
  org_id: string, 
  worker_user_id: string
) {
  const remover_membership = await assert_org_permission(remover_id, org_id);

  if (remover_id === worker_user_id && remover_membership.access_role === AccessRole.OWNER) {
    await ensure_multiple_owners(org_id);
  }

  await delete_membership(worker_user_id, org_id);

  return { success: true, removed_user_id: worker_user_id };
}

// ==================================================
// CHANGE WORKER ROLE
// ==================================================
export async function change_worker_role_service(
  changer_id: string, 
  org_id: string, 
  worker_user_id: string, 
  new_role: AccessRole
) {
  const changer_membership = await assert_org_permission(changer_id, org_id);

  if (new_role === AccessRole.OWNER && changer_membership.access_role !== AccessRole.OWNER) {
    throw new Error('Forbidden: only owners can promote to owner role');
  }

  if (
    changer_id === worker_user_id && 
    changer_membership.access_role === AccessRole.OWNER && 
    new_role !== AccessRole.OWNER
  ) {
    await ensure_multiple_owners(org_id);
  }

  const updated_membership = await update_membership_role(
    worker_user_id, 
    org_id, 
    new_role
  );

  return { success: true, membership: updated_membership };
}
