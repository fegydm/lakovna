// File: back/src/services/vehicle.service.ts
// Last change: Refactored to align with SSoT and Bridge Layer conventions.

import {
  get_raw_vehicle_tracking_data_from_db,
  get_all_vehicles_from_db,
  get_vehicle_by_id_from_db,
  create_vehicle_in_db,
  update_vehicle_in_db,
  delete_vehicle_from_db,
} from '../utils/bridge-vehicle.utils';
import type {
  TaskProgressStatus,
  VehicleInfo,
  StageInfo,
  TaskInfo,
  AccessRole,
  BusinessRole,
  MembershipStatus,
} from 'common/types/project.types';

// =================================================================
// HELPER TYPES & MAPPERS
// =================================================================

// Helper types for snake_case data from the bridge layer.
type BridgeStage = {
  id: string;
  name: string;
  sequence: number;
};

type BridgeTask = {
  title: string;
  sequence: number;
};

type BridgeVehicleTask = {
  status: TaskProgressStatus;
  task: BridgeTask;
};

type BridgeVehicle = {
  id: string;
  brand: string;
  model: string;
  registration_number: string;
  vin?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  current_stage?: BridgeStage | null;
  current_stage_id?: string | null;
  status: TaskProgressStatus;
  entry_time: Date;
  estimated_completion?: Date;
  tasks?: BridgeVehicleTask[];
};

/**
 * Maps a snake_case bridge vehicle object to a camelCase VehicleInfo object.
 */
function mapBridgeToVehicleInfo(vehicle: BridgeVehicle): VehicleInfo {
  return {
    id: vehicle.id,
    brand: vehicle.brand,
    model: vehicle.model,
    registrationNumber: vehicle.registration_number,
    vin: vehicle.vin,
    customer: {
      name: vehicle.customer_name,
      email: vehicle.customer_email,
      phone: vehicle.customer_phone,
    },
    currentStage: vehicle.current_stage
      ? {
          id: vehicle.current_stage.id,
          name: vehicle.current_stage.name,
          sequence: vehicle.current_stage.sequence,
          // Omitting other StageInfo fields as they are not provided by this bridge function
        }
      : null,
    currentStageId: vehicle.current_stage_id,
    status: vehicle.status,
    entryTime: vehicle.entry_time,
    estimatedCompletion: vehicle.estimated_completion,
  };
}

// =================================================================
// DTOs (Data Transfer Objects) for service inputs
// =================================================================

interface CreateVehicleData {
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

interface UpdateVehicleData {
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

// =================================================================
// SERVICE FUNCTIONS
// =================================================================

/**
 * Retrieves and processes detailed tracking data for a single vehicle via its public token.
 */
export async function getProcessedVehicleTrackingDataService(token: string) {
  const data = (await get_raw_vehicle_tracking_data_from_db(
    token
  )) as BridgeVehicle | null;

  if (!data) {
    return null;
  }

  // Further processing or direct mapping can be done here.
  // For now, we'll map it to a structure similar to VehicleInfo but with tasks.
  return {
    brand: data.brand,
    model: data.model,
    registrationNumber: data.registration_number,
    status: data.status,
    entryTime: data.entry_time,
    estimatedCompletion: data.estimated_completion,
    currentStage: data.current_stage,
    tasks: data.tasks,
  };
}

/**
 * Service to get all vehicles.
 */
export async function getAllVehiclesService() {
  const vehicles = (await get_all_vehicles_from_db()) as BridgeVehicle[];
  return vehicles.map(mapBridgeToVehicleInfo);
}

/**
 * Service to get a single vehicle by its ID.
 */
export async function getVehicleByIdService(id: string) {
  const vehicle = (await get_vehicle_by_id_from_db(id)) as BridgeVehicle | null;
  return vehicle ? mapBridgeToVehicleInfo(vehicle) : null;
}

/**
 * Service to create a new vehicle.
 */
export async function createVehicleService(data: CreateVehicleData) {
  const newVehicle = (await create_vehicle_in_db({
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
    status: data.status,
  })) as BridgeVehicle;

  return mapBridgeToVehicleInfo(newVehicle);
}

/**
 * Service to update a vehicle.
 */
export async function updateVehicleService(id: string, data: UpdateVehicleData) {
  const updatedVehicle = (await update_vehicle_in_db(id, {
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
    status: data.status,
  })) as BridgeVehicle;

  return mapBridgeToVehicleInfo(updatedVehicle);
}

/**
 * Service to delete a vehicle.
 */
export async function deleteVehicleService(id: string) {
  return await delete_vehicle_from_db(id);
}
