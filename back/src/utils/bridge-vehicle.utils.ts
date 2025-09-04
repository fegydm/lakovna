// File: back/src/utils/bridge-vehicle.utils.ts
// Last change: Aligned with camelCase conventions and decoupled from Prisma types.
// Changes: Corrected relation names and handled missing schema fields to resolve TypeScript errors.

import { prisma } from '../core/prisma.client';
import { TaskProgressStatus } from 'common/types/project.types';
import { randomUUID } from 'crypto';

interface CreateVehicleInput {
  organizationId: string;
  brand: string;
  model: string;
  registrationNumber: string;
  vin?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  entryTime: Date;
  estimatedCompletion?: Date;
  currentStageId?: string;
  status: TaskProgressStatus;
}

interface UpdateVehicleInput {
  brand?: string;
  model?: string;
  registrationNumber?: string;
  vin?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  entryTime?: Date;
  estimatedCompletion?: Date;
  currentStageId?: string;
  status?: TaskProgressStatus;
}

export const getRawVehicleTrackingDataFromDb = (token: string) => {
  return prisma.vehicle.findUnique({
    where: { tracking_token: token },
    select: {
      brand: true,
      model: true,
      registration_number: true,
      // FIX (Error 1): The 'status' field does not exist on the 'Vehicle' model
      // and has been removed from the select clause. To use it, add the field
      // to the 'Vehicle' model in your 'schema.prisma' file.
      // status: true,
      entry_time: true,
      estimated_completion: true,
      current_stage: {
        select: {
          name: true,
          sequence: true,
        },
      },
      // FIX: The original query structure for 'tasks' was incorrect based on the
      // generated Prisma types. The types indicate a direct relation to the 'Task'
      // model, not a join model. The query has been simplified to reflect this.
      // NOTE: To retrieve a 'status' for each task, you must define an explicit
      // many-to-many relation in your 'schema.prisma' file.
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
};

export const getAllVehiclesFromDb = () => {
  return prisma.vehicle.findMany({
    include: { current_stage: true },
  });
};

export const getVehicleByIdFromDb = (id: string) => {
  return prisma.vehicle.findUnique({
    where: { id },
    // FIX (Error 2): Reverted relation name from 'vehicleTasks' back to 'tasks'
    // as 'vehicleTasks' does not exist according to the Prisma schema.
    include: { current_stage: true, tasks: true },
  });
};

export const createVehicleInDb = (data: CreateVehicleInput) => {
  return prisma.vehicle.create({
    data: {
      organization_id: data.organizationId,
      brand: data.brand,
      model: data.model,
      registration_number: data.registrationNumber,
      vin: data.vin,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.customerPhone,
      entry_time: data.entryTime,
      estimated_completion: data.estimatedCompletion,
      current_stage_id: data.currentStageId,
      // FIX: The 'status' field does not exist on the 'Vehicle' model.
      // This line remains commented out. Add the field to your schema to use it.
      // status: data.status,
      // FIX (Error 3): Added mandatory fields 'qr_code_token' and 'tracking_token'
      // which were missing from the create input. They are now generated automatically.
      qr_code_token: randomUUID(),
      tracking_token: randomUUID(),
    },
  });
};

export const updateVehicleInDb = (id: string, data: UpdateVehicleInput) => {
  return prisma.vehicle.update({
    where: { id },
    data: {
      brand: data.brand,
      model: data.model,
      registration_number: data.registrationNumber,
      vin: data.vin,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.customerPhone,
      entry_time: data.entryTime,
      estimated_completion: data.estimatedCompletion,
      current_stage_id: data.currentStageId,
      // FIX (Error 4): Similar to the create function, the 'status' field does not exist
      // on the 'Vehicle' model according to the Prisma types. It's commented out
      // to allow the code to compile. Please update your schema accordingly.
      // status: data.status,
    },
  });
};

export const deleteVehicleFromDb = (id: string) => {
  return prisma.vehicle.delete({
    where: { id },
  });
};

