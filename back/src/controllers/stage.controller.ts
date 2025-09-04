// File: back/src/controllers/stage.controller.ts
// Last change: Fixed color_hsl destructuring to match interface and usage

import { Request, Response } from 'express';
import {
  get_all_stages_for_org,
  get_stage_by_id,
  create_stage,
  update_stage,
  delete_stage,
  check_sequence_exists_in_org,
  get_stage_with_vehicles_check,
  verify_stage_belongs_to_org
} from '../utils/bridge-stage.utils';
import {
  get_membership_by_user_and_org,
} from '../utils/bridge-organization.utils';
import { AccessRole } from 'common/types/access-role.types';
import { MembershipStatus } from 'common/types/auth backup.types';

interface AuthenticatedUser {
  id: string;
}

interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export const get_all_stages = async (req: AuthRequest, res: Response) => {
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

    const stages = await get_all_stages_for_org(org_id);
    
    res.status(200).json({
      is_success: true,
      data: stages
    });
  } catch (error) {
    console.error('[STAGE] Error fetching stages:', error);
    res.status(500).json({
      is_success: false,
      error: 'Failed to fetch stages'
    });
  }
};

export const get_stage_details = async (req: AuthRequest, res: Response) => {
  try {
    const { org_id, stage_id } = req.params;
    const user = req.user!;

    const membership = await get_membership_by_user_and_org(user.id, org_id);
    if (!membership || membership.status !== MembershipStatus.Active) {
      return res.status(403).json({
        is_success: false,
        error: 'Forbidden: You are not a member of this organization'
      });
    }

    const belongs_to_org = await verify_stage_belongs_to_org(stage_id, org_id);
    if (!belongs_to_org) {
      return res.status(404).json({
        is_success: false,
        error: 'Stage not found in this organization'
      });
    }

    const stage = await get_stage_by_id(stage_id);
    if (!stage) {
      return res.status(404).json({
        is_success: false,
        error: 'Stage not found'
      });
    }
    
    res.status(200).json({
      is_success: true,
      data: stage
    });
  } catch (error) {
    console.error(`[STAGE] Error fetching stage ${req.params.stage_id}:`, error);
    res.status(500).json({
      is_success: false,
      error: 'Failed to fetch stage'
    });
  }
};

export const create_new_stage = async (req: AuthRequest, res: Response) => {
  try {
    const { org_id } = req.params;
    const { name, icon, color_hsl, position_x, position_y, sequence } = req.body;
    const user = req.user!;

    if (!name || sequence === undefined) {
      return res.status(400).json({
        is_success: false,
        error: 'Name and sequence are required'
      });
    }

    if (typeof sequence !== 'number') {
      return res.status(400).json({
        is_success: false,
        error: 'Sequence must be a number'
      });
    }

    if (position_x !== undefined && typeof position_x !== 'number') {
      return res.status(400).json({
        is_success: false,
        error: 'Position_x must be a number'
      });
    }

    if (position_y !== undefined && typeof position_y !== 'number') {
      return res.status(400).json({
        is_success: false,
        error: 'Position_y must be a number'
      });
    }

    const membership = await get_membership_by_user_and_org(user.id, org_id);
    if (!membership || ![AccessRole.Owner, AccessRole.Manager].includes(membership.access_role)) {
      return res.status(403).json({
        is_success: false,
        error: 'Forbidden: Only owners and managers can create stages'
      });
    }

    const sequence_exists = await check_sequence_exists_in_org(org_id, sequence);
    if (sequence_exists) {
      return res.status(409).json({
        is_success: false,
        error: 'A stage with this sequence already exists in this organization'
      });
    }

    const new_stage = await create_stage({
      name,
      icon,
      color_hsl,
      position_x,
      position_y,
      sequence,
      organization_id: org_id
    });
    
    res.status(201).json({
      is_success: true,
      data: new_stage,
      message: 'Stage created successfully'
    });
  } catch (error) {
    console.error('[STAGE] Error creating stage:', error);
    res.status(500).json({
      is_success: false,
      error: 'Failed to create stage'
    });
  }
};

export const update_stage_details = async (req: AuthRequest, res: Response) => {
  try {
    const { org_id, stage_id } = req.params;
    const user = req.user!;

    const membership = await get_membership_by_user_and_org(user.id, org_id);
    if (!membership || ![AccessRole.Owner, AccessRole.Manager].includes(membership.access_role)) {
      return res.status(403).json({
        is_success: false,
        error: 'Forbidden: Only owners and managers can update stages'
      });
    }

    const belongs_to_org = await verify_stage_belongs_to_org(stage_id, org_id);
    if (!belongs_to_org) {
      return res.status(404).json({
        is_success: false,
        error: 'Stage not found in this organization'
      });
    }

    if (req.body.sequence !== undefined) {
      const sequence_exists = await check_sequence_exists_in_org(
        org_id, 
        req.body.sequence, 
        stage_id
      );
      if (sequence_exists) {
        return res.status(409).json({
          is_success: false,
          error: 'A stage with this sequence already exists in this organization'
        });
      }
    }

    const updated_stage = await update_stage(stage_id, req.body);
    
    res.status(200).json({
      is_success: true,
      data: updated_stage,
      message: 'Stage updated successfully'
    });
  } catch (error) {
    console.error(`[STAGE] Error updating stage ${req.params.stage_id}:`, error);
    res.status(500).json({
      is_success: false,
      error: 'Failed to update stage'
    });
  }
};

export const delete_stage_by_id = async (req: AuthRequest, res: Response) => {
  try {
    const { org_id, stage_id } = req.params;
    const user = req.user!;

    const membership = await get_membership_by_user_and_org(user.id, org_id);
    if (!membership || ![AccessRole.Owner, AccessRole.Manager].includes(membership.access_role)) {
      return res.status(403).json({
        is_success: false,
        error: 'Forbidden: Only owners and managers can delete stages'
      });
    }

    const belongs_to_org = await verify_stage_belongs_to_org(stage_id, org_id);
    if (!belongs_to_org) {
      return res.status(404).json({
        is_success: false,
        error: 'Stage not found in this organization'
      });
    }

    const stage_check = await get_stage_with_vehicles_check(stage_id);
    if (!stage_check) {
      return res.status(404).json({
        is_success: false,
        error: 'Stage not found'
      });
    }
    
    if (stage_check.has_vehicles) {
      return res.status(409).json({
        is_success: false,
        error: `Cannot delete stage with ${stage_check.vehicle_count} vehicles. Move vehicles first.`
      });
    }

    await delete_stage(stage_id);
    
    res.status(200).json({
      is_success: true,
      message: 'Stage deleted successfully'
    });
  } catch (error) {
    console.error(`[STAGE] Error deleting stage ${req.params.stage_id}:`, error);
    res.status(500).json({
      is_success: false,
      error: 'Failed to delete stage'
    });
  }
};