// File: back/src/controllers/organization.controller.ts
// Last change: Refactored to remove direct Prisma dependency and fixed type errors.

import { Request, Response } from 'express';
import {
  invite_worker_by_email_service,
  approve_membership_request_service,
  remove_worker_from_org_service,
  change_worker_role_service
} from '../services/organization.service';
import {
  get_organization_by_id,
  get_membership_by_user_and_org,
  update_organization,
  // --- NOVÉ FUNKCIE, KTORÉ TREBA PRIDAŤ DO UTILS ---
  count_active_members_in_org,
  count_vehicles_in_org,
  get_organization_members_list,
} from '../utils/bridge-organization.utils';
// import { prisma } from '../core/prisma.client'; // Odstránená priama závislosť
import { AccessRole } from 'common/types/access-role.types';
import { MembershipStatus } from 'common/types/auth backup.types';

// --- ODPORÚČANIE: Tento typ definujte v zdieľanom súbore (napr. 'common/types/auth.types.ts') ---
// Definuje typ pre overeného používateľa, ktorý je pripojený k požiadavke (request)
interface AuthenticatedUser {
  id: string; // Alebo number, podľa vašej schémy
  // ...ďalšie vlastnosti používateľa
}

// Definuje vlastný typ Request, ktorý obsahuje informácie o používateľovi
interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}
// --- Koniec odporúčanej definície ---


export const get_organization_details = async (req: AuthRequest, res: Response) => {
  try {
    const { org_id } = req.params;
    const user = req.user!;

    const membership = await get_membership_by_user_and_org(user.id, org_id);
    if (!membership || membership.status !== MembershipStatus.Active) {
      return res.status(403).json({
        is_success: false,
        error: 'Forbidden: You are not a member of this organization'
      });
    }

    const organization = await get_organization_by_id(org_id);
    if (!organization) {
      return res.status(404).json({
        is_success: false,
        error: 'Organization not found'
      });
    }

    const response_data = {
      id: organization.id,
      name: organization.name,
      type: organization.type,
      description: organization.description,
      is_verified: organization.is_verified,
      your_role: membership.access_role,
      your_business_role: membership.business_role
    };

    if ([AccessRole.Owner, AccessRole.Manager].includes(membership.access_role)) {
      // Nahradené priame volania Prisma za utility funkcie
      const member_count = await count_active_members_in_org(org_id);
      const vehicle_count = await count_vehicles_in_org(org_id);

      Object.assign(response_data, {
        statistics: {
          total_members: member_count,
          total_vehicles: vehicle_count
        }
      });
    }

    res.status(200).json({ is_success: true, data: response_data });
  } catch (error) {
    console.error('[ORGANIZATION] Error fetching details:', error);
    res.status(500).json({
      is_success: false,
      error: 'Failed to fetch organization details'
    });
  }
};

export const update_organization_details = async (req: AuthRequest, res: Response) => {
  try {
    const { org_id } = req.params;
    const { name, type, description } = req.body;
    const user = req.user!;

    const membership = await get_membership_by_user_and_org(user.id, org_id);
    if (!membership || membership.access_role !== AccessRole.Owner) {
      return res.status(403).json({
        is_success: false,
        error: 'Forbidden: Only owners can update organization details'
      });
    }

    const updated_org = await update_organization(org_id, {
      name,
      type,
      description
    });

    res.status(200).json({
      is_success: true,
      data: updated_org,
      message: 'Organization updated successfully'
    });
  } catch (error) {
    console.error('[ORGANIZATION] Error updating:', error);
    res.status(500).json({
      is_success: false,
      error: 'Failed to update organization'
    });
  }
};

export const get_organization_members = async (req: AuthRequest, res: Response) => {
  try {
    const { org_id } = req.params;
    const user = req.user!;

    const membership = await get_membership_by_user_and_org(user.id, org_id);
    if (!membership || membership.status !== MembershipStatus.Active) {
      return res.status(403).json({
        is_success: false,
        error: 'Forbidden: You are not a member of this organization'
      });
    }

    // Logika pre získavanie a formátovanie členov bola presunutá do novej utility funkcie.
    // Táto funkcia by mala interne zohľadniť rolu žiadateľa (requester's role).
    const members = await get_organization_members_list(org_id, membership.access_role);

    res.status(200).json({
      is_success: true,
      data: members
    });
  } catch (error) {
    console.error('[ORGANIZATION] Error fetching members:', error);
    res.status(500).json({
      is_success: false,
      error: 'Failed to fetch organization members'
    });
  }
};

export const invite_member = async (req: AuthRequest, res: Response) => {
  try {
    const { org_id } = req.params;
    const { email, access_role } = req.body;
    const user = req.user!;

    if (!email || !access_role) {
      return res.status(400).json({
        is_success: false,
        error: 'Email and access_role are required'
      });
    }

    const result = await invite_worker_by_email_service(
      user.id,
      org_id,
      email,
      access_role
    );

    res.status(201).json({
      is_success: true,
      data: result.invite,
      message: `Invitation sent to ${email}`
    });
  } catch (error: any) {
    console.error('[ORGANIZATION] Error inviting member:', error);
    if (error.message === 'Forbidden: insufficient permissions') {
      return res.status(403).json({
        is_success: false,
        error: error.message
      });
    }
    res.status(500).json({
      is_success: false,
      error: 'Failed to send invitation'
    });
  }
};

export const approve_membership = async (req: AuthRequest, res: Response) => {
  try {
    const { request_id } = req.params;
    const user = req.user!;

    const result = await approve_membership_request_service(user.id, request_id);

    res.status(200).json({
      is_success: true,
      data: result.membership,
      message: 'Membership approved successfully'
    });
  } catch (error: any) {
    console.error('[ORGANIZATION] Error approving membership:', error);
    if (error.message.includes('Forbidden') || error.message.includes('not found')) {
      return res.status(403).json({
        is_success: false,
        error: error.message
      });
    }
    res.status(500).json({
      is_success: false,
      error: 'Failed to approve membership'
    });
  }
};

export const remove_member = async (req: AuthRequest, res: Response) => {
  try {
    const { org_id, user_id } = req.params;
    const user = req.user!;

    const result = await remove_worker_from_org_service(user.id, org_id, user_id);

    res.status(200).json({
      is_success: true,
      data: result,
      message: 'Member removed successfully'
    });
  } catch (error: any) {
    console.error('[ORGANIZATION] Error removing member:', error);
    if (error.message.includes('Forbidden') || error.message.includes('last owner')) {
      return res.status(403).json({
        is_success: false,
        error: error.message
      });
    }
    res.status(500).json({
      is_success: false,
      error: 'Failed to remove member'
    });
  }
};

export const change_member_role = async (req: AuthRequest, res: Response) => {
  try {
    const { org_id, user_id } = req.params;
    const { new_role } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        is_success: false,
        error: 'Unauthorized'
      });
    }

    if (!new_role) {
      return res.status(400).json({
        is_success: false,
        error: 'new_role is required'
      });
    }
    
    // Chyba `user.id` je opravená vďaka typu AuthRequest
    const result = await change_worker_role_service(user.id, org_id, user_id, new_role);

    res.status(200).json({
      is_success: true,
      data: result.membership,
      message: 'Role changed successfully'
    });
  } catch (error: any) {
    console.error('[ORGANIZATION] Error changing role:', error);
    if (error.message.includes('Forbidden') || error.message.includes('last owner')) {
      return res.status(403).json({
        is_success: false,
        error: error.message
      });
    }
    res.status(500).json({
      is_success: false,
      error: 'Failed to change role'
    });
  }
};