// File: back/src/utils/bridge-stage.utils.ts
// Last change: Implemented data transformation for HslColor type consistency.

import { prisma } from '../core/prisma.client';
import type { Prisma } from '@prisma/client';
import {
  CreateStagePayload,
  StageDTO,
  StageDetailsDTO,
  StageWithVehicleCheckDTO,
  UpdateStagePayload,
} from 'common/types/stage.types';

import { formatHslObject, parseHslString } from 'common/utils/color.utils';

export async function getAllStagesForOrg(organizationId: string): Promise<StageDTO[]> {
  const stagesFromDb = await prisma.stage.findMany({
    where: {
      organizationId: organizationId,
      isActive: true,
    },
    orderBy: { sequence: 'asc' },
    include: {
      tasks: {
        orderBy: { sequence: 'asc' },
      },
    },
  });

  // ZMENA: Transformujeme DB string na HslColor objekt pre každý stage
  return stagesFromDb.map(stage => ({
    ...stage,
    colorHsl: parseHslString(stage.colorHsl),
  }));
}

export async function getStageById(stageId: string): Promise<StageDetailsDTO | null> {
  const stageFromDb = await prisma.stage.findUnique({
    where: { id: stageId },
    include: {
      tasks: { orderBy: { sequence: 'asc' } },
      vehiclesInStage: {
        select: { id: true, brand: true, model: true, registrationNumber: true },
      },
    },
  });

  if (!stageFromDb) return null;

  // ZMENA: Transformujeme DB string na HslColor objekt
  return {
    ...stageFromDb,
    colorHsl: parseHslString(stageFromDb.colorHsl),
  };
}

export async function createStage(data: CreateStagePayload): Promise<StageDTO> {
  // ZMENA: Používame centrálnu utilitu na formátovanie objektu na string pre DB
  const colorHslString = data.colorHsl ? formatHslObject(data.colorHsl) : undefined;

  const newStage = await prisma.stage.create({
    data: {
      name: data.name,
      icon: data.icon,
      colorHsl: colorHslString,
      sequence: data.sequence,
      organizationId: data.organizationId,
      isActive: data.isActive,
      isRequired: data.isRequired,
      key: data.name.toLowerCase().replace(/\s+/g, '_'),
    },
    include: {
      tasks: { orderBy: { sequence: 'asc' } },
    },
  });

  return {
    ...newStage,
    colorHsl: parseHslString(newStage.colorHsl),
  };
}

export async function updateStage(stageId: string, data: UpdateStagePayload): Promise<StageDTO> {
  let colorHslString: string | null | undefined = undefined;
  if (data.colorHsl === null) {
    colorHslString = null;
  } else if (data.colorHsl) {
    // ZMENA: Používame centrálnu utilitu
    colorHslString = formatHslObject(data.colorHsl);
  }

  const updatedStage = await prisma.stage.update({
    where: { id: stageId },
    data: {
      name: data.name,
      icon: data.icon,
      colorHsl: colorHslString,
      sequence: data.sequence,
      isActive: data.isActive,
      isRequired: data.isRequired,
    },
    include: {
      tasks: { orderBy: { sequence: 'asc' } },
    },
  });

  return {
    ...updatedStage,
    colorHsl: parseHslString(updatedStage.colorHsl),
  };
}

export async function deleteStage(stageId: string): Promise<{ success: boolean }> {
  await prisma.stage.delete({
    where: { id: stageId },
  });
  return { success: true };
}

export async function checkSequenceExistsInOrg(organizationId: string, sequence: number, excludeStageId?: string): Promise<boolean> {
  const whereClause: Prisma.StageWhereInput = {
    organizationId,
    sequence,
  };
  if (excludeStageId) {
    whereClause.id = { not: excludeStageId };
  }
  const count = await prisma.stage.count({ where: whereClause });
  return count > 0;
}

export async function countVehiclesInStage(stageId: string): Promise<number> {
  return prisma.vehicle.count({
    where: { currentStageId: stageId },
  });
}

export async function getStageWithVehiclesCheck(stageId: string): Promise<StageWithVehicleCheckDTO | null> {
  const stageFromDb = await prisma.stage.findUnique({
    where: { id: stageId },
    include: {
      _count: {
        select: { vehiclesInStage: true },
      },
      tasks: { orderBy: { sequence: 'asc' } },
    },
  });

  if (!stageFromDb) return null;

  // ZMENA: Transformujeme DB string na HslColor objekt aj tu
  const transformedStage: StageDTO = {
    ...stageFromDb,
    colorHsl: parseHslString(stageFromDb.colorHsl),
  };

  return {
    stage: transformedStage,
    hasVehicles: stageFromDb._count.vehiclesInStage > 0,
    vehicleCount: stageFromDb._count.vehiclesInStage,
  };
}

export async function verifyStageBelongsToOrg(stageId: string, organizationId: string): Promise<boolean> {
  const stage = await prisma.stage.findFirst({
    where: { id: stageId, organizationId: organizationId },
    select: { id: true },
  });
  return !!stage;
}