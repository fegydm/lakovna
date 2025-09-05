// File: back/src/utils/bridge-vehicle.utils.ts
// Last change: Final fix for nested type transformation (currentStage.colorHsl).

import { prisma } from '../core/prisma.client';
import { randomUUID } from 'crypto';
import type { Prisma } from '@prisma/client';
import type { CreateVehiclePayload, UpdateVehiclePayload, VehicleTrackingDTO, VehicleInfo } from 'common/types/vehicle.types';
// ZMENA: Pridávame import pre našu centrálnu funkciu na parsovanie farieb
import { parseHslString } from 'common/utils/color.utils';

// =====================================================================
// Centrálna transformačná funkcia
// =====================================================================

// Definujeme si presný typ, ktorý vracia Prisma, aby sme mali istotu.
type PrismaVehicle = Prisma.VehicleGetPayload<{
  include: { 
    currentStage: { include: { tasks: true } };
    tasks: true 
  };
}>;

/**
 * Transforms a vehicle object from Prisma into the application's VehicleInfo DTO.
 * This is the single source of truth for this transformation.
 * @param vehicle The raw vehicle object from Prisma.
 * @returns A formatted VehicleInfo object, or null.
 */
function transformPrismaVehicleToDTO(vehicle: PrismaVehicle | null): VehicleInfo | null {
  if (!vehicle) {
    return null;
  }

  const {
    customerName,
    customerEmail,
    customerPhone,
    qrCodeToken,
    trackingToken,
    currentStage, // Explicitne oddelíme currentStage, aby sme ho mohli upraviť
    ...restOfVehicle
  } = vehicle;

  // ZMENA: Vytvoríme nový, transformovaný objekt pre stage, kde opravíme `colorHsl`
  const transformedStage = currentStage
    ? {
        ...currentStage,
        colorHsl: parseHslString(currentStage.colorHsl), // Aplikujeme transformáciu
      }
    : null;

  // Vytvoríme finálny DTO objekt s opraveným `currentStage`
  return {
    ...restOfVehicle,
    currentStage: transformedStage, // Použijeme transformovaný stage
    customer: {
      name: customerName,
      email: customerEmail ?? undefined,
      phone: customerPhone ?? undefined,
    },
    qrCode: qrCodeToken,
    trackingToken: trackingToken,
  };
}

// =====================================================================
// EXPORTOVANÉ BRIDGE FUNKCIE
// =====================================================================

export async function getVehicleTrackingData(token: string): Promise<VehicleTrackingDTO | null> {
  return prisma.vehicle.findUnique({
    where: { trackingToken: token },
    select: {
      brand: true,
      model: true,
      registrationNumber: true,
      entryTime: true,
      estimatedCompletion: true,
      currentStage: {
        select: {
          name: true,
          sequence: true,
        },
      },
      tasks: {
        select: {
          title: true,
          sequence: true,
        },
        orderBy: {
          sequence: 'asc',
        },
      },
    },
  });
}

export async function getAllVehicles(): Promise<VehicleInfo[]> {
  const vehiclesFromDb = await prisma.vehicle.findMany({
    include: {
      tasks: { orderBy: { sequence: 'asc' } },
      currentStage: {
        include: {
          tasks: { orderBy: { sequence: 'asc' } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return vehiclesFromDb.map(transformPrismaVehicleToDTO).filter((v): v is VehicleInfo => v !== null);
}

export async function getVehicleById(id: string): Promise<VehicleInfo | null> {
  const vehicleFromDb = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      tasks: { orderBy: { sequence: 'asc' } },
      currentStage: {
        include: {
          tasks: { orderBy: { sequence: 'asc' } },
        },
      },
    },
  });
  return transformPrismaVehicleToDTO(vehicleFromDb);
}

export async function createVehicle(data: CreateVehiclePayload): Promise<VehicleInfo> {
  const newVehicleFromDb = await prisma.vehicle.create({
    data: {
      ...data,
      qrCodeToken: randomUUID(),
      trackingToken: randomUUID(),
    },
    include: {
      tasks: { orderBy: { sequence: 'asc' } },
      currentStage: {
        include: {
          tasks: { orderBy: { sequence: 'asc' } },
        },
      },
    },
  });
  return transformPrismaVehicleToDTO(newVehicleFromDb)!;
}

export async function updateVehicle(id: string, data: UpdateVehiclePayload): Promise<VehicleInfo> {
  const updatedVehicleFromDb = await prisma.vehicle.update({
    where: { id },
    data,
    include: {
      tasks: { orderBy: { sequence: 'asc' } },
      currentStage: {
        include: {
          tasks: { orderBy: { sequence: 'asc' } },
        },
      },
    },
  });
  return transformPrismaVehicleToDTO(updatedVehicleFromDb)!;
}

export async function deleteVehicle(id: string): Promise<{ success: boolean; id: string }> {
  await prisma.vehicle.delete({
    where: { id },
  });
  return { success: true, id };
}