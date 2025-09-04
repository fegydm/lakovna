// File: back/src/utils/prisma-mappers.utils.ts
// Last change: Corrected HSL color type inconsistency and parsing logic.

import { PROJECT_CONFIG } from 'common/configs/project.config';
import { ACCESS_ROLES } from 'common/configs/01-constants.config';
import type {
  AuthUser,
  AuthMembership,
  Invite,
  StageInfo,
  StageTaskInfo,
  AccessRole,
  MembershipStatus,
  AuthMethod,
  TaskPriority,
  TaskProgressStatus,
  BusinessRole,
  HslColor,
} from 'common/types/project.types';

type PrismaUser = {
  id: string;
  name: string;
  email: string;
  password?: string | null;
  is_verified: boolean;
  is_active: boolean;
  memberships: PrismaMembership[];
};

type PrismaMembership = {
  id: string;
  organization_id: string;
  user_id: string;
  access_role: string;
  business_role?: string | null;
  status: string;
  auth_methods: string[];
};

type PrismaInvite = {
  id: string;
  organization_id: string;
  email: string;
  access_role: string;
  token: string;
  expires_at: Date;
};

type PrismaStageTask = {
  id: string;
  title: string;
  description?: string | null;
  sequence: number;
  priority: string | null;
  estimated_duration?: number | null;
  status?: string | null;
  stage_id: string;
  created_at: Date;
  updated_at: Date;
};

type PrismaStage = {
  id: string;
  name: string;
  icon?: string | null;
  color_hsl?: string | null;
  position_x?: number | null;
  position_y?: number | null;
  sequence: number;
  is_active: boolean;
  is_required: boolean;
  organization_id: string;
  tasks: PrismaStageTask[];
  created_at: Date;
  updated_at: Date;
};

export const mapPrismaMembershipToCommon = (prismaMembership: PrismaMembership | null): AuthMembership | null => {
  if (!prismaMembership) return null;

  const dbBusinessRole = prismaMembership.business_role;

  return {
    organizationId: prismaMembership.organization_id,
    role: prismaMembership.access_role as AccessRole,
    businessRole:
      dbBusinessRole && (PROJECT_CONFIG.businessRoles as readonly string[]).includes(dbBusinessRole)
        ? (dbBusinessRole as BusinessRole)
        : null,
    status: prismaMembership.status as MembershipStatus,
  };
};

export const mapPrismaUserToCommon = (prismaUser: PrismaUser | null): AuthUser | null => {
  if (!prismaUser) return null;

  const { password, ...userData } = prismaUser;

  const memberships = (userData.memberships || [])
    .map(mapPrismaMembershipToCommon)
    .filter(Boolean) as AuthMembership[];

  const primaryAccessRole = memberships[0]?.role ?? ACCESS_ROLES.VIEWER;

  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    isVerified: userData.is_verified,
    accessRole: primaryAccessRole,
    businessRole: memberships[0]?.businessRole ?? null,
    memberships: memberships,
  };
};

export const mapPrismaInviteToCommon = (prismaInvite: PrismaInvite | null): Invite | null => {
  if (!prismaInvite) return null;
  return {
    id: prismaInvite.id,
    organizationId: prismaInvite.organization_id,
    email: prismaInvite.email,
    accessRole: prismaInvite.access_role as AccessRole,
    token: prismaInvite.token,
    expiresAt: prismaInvite.expires_at,
  };
};

export const mapPrismaStageTaskToCommon = (prismaTask: PrismaStageTask | null): StageTaskInfo | null => {
  if (!prismaTask) return null;
  return {
    id: prismaTask.id,
    title: prismaTask.title,
    description: prismaTask.description,
    sequence: prismaTask.sequence,
    priority: prismaTask.priority as TaskPriority,
    estimatedDuration: prismaTask.estimated_duration,
    status: prismaTask.status as TaskProgressStatus,
    stageId: prismaTask.stage_id,
    createdAt: prismaTask.created_at,
    updatedAt: prismaTask.updated_at,
  };
};

export const mapPrismaStageToCommon = (prismaStage: PrismaStage | null): StageInfo | null => {
  if (!prismaStage) return null;

  const colorParts = prismaStage.color_hsl?.split(',').map(Number);
  const colorHslObject =
    colorParts?.length === 3 && !colorParts.some(isNaN)
      ? { h: colorParts[0], s: colorParts[1], l: colorParts[2] }
      : null;

  return {
    id: prismaStage.id,
    name: prismaStage.name,
    icon: prismaStage.icon,
    colorHsl: colorHslObject,
    positionX: prismaStage.position_x,
    positionY: prismaStage.position_y,
    sequence: prismaStage.sequence,
    isActive: prismaStage.is_active,
    isRequired: prismaStage.is_required,
    organizationId: prismaStage.organization_id,
    tasks: (prismaStage.tasks || []).map(mapPrismaStageTaskToCommon).filter(Boolean) as StageTaskInfo[],
    createdAt: prismaStage.created_at,
    updatedAt: prismaStage.updated_at,
  };
};