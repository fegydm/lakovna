// File: back/src/utils/bridge-stage.utils.ts
// Last change: Fixed all type errors related to Prisma inputs and mapper compatibility.

import { prisma } from '../core/prisma.client';
import type { Prisma } from '@prisma/client';
import { mapPrismaStageToCommon } from './prisma-mappers.utils';
import type { HslColor } from 'common/types/project.types';

interface CreateStageData {
  name: string;
  icon?: string;
  colorHsl?: HslColor | null;
  sequence: number;
  organizationId: string;
  isActive?: boolean;
  isRequired?: boolean;
}

interface UpdateStageData {
  name?: string;
  icon?: string;
  colorHsl?: HslColor | null;
  sequence?: number;
  isActive?: boolean;
  isRequired?: boolean;
}

export async function getAllStagesForOrg(organizationId: string) {
  const stages = await prisma.stage.findMany({
    where: {
      organization_id: organizationId,
      is_active: true,
    },
    orderBy: { sequence: 'asc' },
    include: {
      tasks: {
        orderBy: { sequence: 'asc' },
      },
    },
  });
  return stages.map(mapPrismaStageToCommon);
}

export async function getStageById(stageId: string) {
  const stage = await prisma.stage.findUnique({
    where: { id: stageId },
    include: {
      tasks: {
        orderBy: { sequence: 'asc' },
      },
      vehicles_in_stage: {
        select: { id: true, brand: true, model: true, registration_number: true },
      },
    },
  });
  return stage ? mapPrismaStageToCommon(stage) : null;
}

export async function createStage(data: CreateStageData) {
  const colorHslString = data.colorHsl ? `${data.colorHsl.h},${data.colorHsl.s},${data.colorHsl.l}` : null;
  const stage = await prisma.stage.create({
    data: {
      name: data.name,
      icon: data.icon,
      color_hsl: colorHslString,
      sequence: data.sequence,
      organization_id: data.organizationId,
      is_active: data.isActive ?? true,
      is_required: data.isRequired ?? false,
    },
    include: {
      tasks: {
        orderBy: { sequence: 'asc' },
      },
    },
  });
  return mapPrismaStageToCommon(stage);
}

export async function updateStage(stageId: string, data: UpdateStageData) {
  let colorHslString: string | null | undefined = undefined;
  if (data.colorHsl === null) {
    colorHslString = null;
  } else if (data.colorHsl) {
    colorHslString = `${data.colorHsl.h},${data.colorHsl.s},${data.colorHsl.l}`;
  }

  const stage = await prisma.stage.update({
    where: { id: stageId },
    data: {
      name: data.name,
      icon: data.icon,
      color_hsl: colorHslString,
      sequence: data.sequence,
      is_active: data.isActive,
      is_required: data.isRequired,
    },
    include: {
      tasks: {
        orderBy: { sequence: 'asc' },
      },
    },
  });
  return mapPrismaStageToCommon(stage);
}

export async function deleteStage(stageId: string) {
  await prisma.stage.delete({
    where: { id: stageId },
  });
  return { success: true };
}

export async function checkStageExists(stageId: string): Promise<boolean> {
  const stage = await prisma.stage.findUnique({
    where: { id: stageId },
    select: { id: true },
  });
  return !!stage;
}

export async function checkSequenceExistsInOrg(
  organizationId: string,
  sequence: number,
  excludeStageId?: string
): Promise<boolean> {
  const whereClause: Prisma.StageWhereInput = {
    organization_id: organizationId,
    sequence,
  };

  if (excludeStageId) {
    whereClause.id = { not: excludeStageId };
  }

  const stage = await prisma.stage.findFirst({
    where: whereClause,
    select: { id: true },
  });
  return !!stage;
}

export async function countVehiclesInStage(stageId: string): Promise<number> {
  return prisma.vehicle.count({
    where: { current_stage_id: stageId },
  });
}

export async function getStageWithVehiclesCheck(stageId: string) {
  const stage = await prisma.stage.findUnique({
    where: { id: stageId },
    include: {
      vehicles_in_stage: {
        select: { id: true },
      },
    },
  });

  if (!stage) return null;
  
  const mappedStage = mapPrismaStageToCommon(stage as any);

  return {
    stage: mappedStage,
    hasVehicles: stage.vehicles_in_stage.length > 0,
    vehicleCount: stage.vehicles_in_stage.length,
  };
}

export async function verifyStageBelongsToOrg(
  stageId: string,
  organizationId: string
): Promise<boolean> {
  const stage = await prisma.stage.findUnique({
    where: { id: stageId },
    select: { organization_id: true },
  });
  return stage?.organization_id === organizationId;
}

export async function getStagesCountForOrg(organizationId: string): Promise<number> {
  return prisma.stage.count({
    where: {
      organization_id: organizationId,
      is_active: true,
    },
  });
}