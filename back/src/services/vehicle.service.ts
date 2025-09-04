// File: back/src/services/vehicle.service.ts
// Last change: Added standard CRUD service functions to support the controller.

import * as vehicle_bridge from '../utils/bridge-vehicle.utils';
import { TaskProgressStatus } from 'common/types/task.types';

// ... (existing ProcessedVehicleTrackingData interface and function)

export interface ProcessedVehicleTrackingData {
  // ...
}

export const get_processed_vehicle_tracking_data_service = async (
  token: string
): Promise<ProcessedVehicleTrackingData | null> => {
  // ... existing implementation
  return null; // Placeholder
};


// --- NEW CRUD SERVICE FUNCTIONS ---

/**
 * Service to get all vehicles.
 */
export const get_all_vehicles_service = () => {
  // A mapper would be used here for type conversion if needed.
  return vehicle_bridge.get_all_vehicles_from_db();
};

/**
 * Service to get a single vehicle by its ID.
 */
export const get_vehicle_by_id_service = (id: string) => {
  return vehicle_bridge.get_vehicle_by_id_from_db(id);
};

/**
 * Service to create a new vehicle.
 */
export const create_vehicle_service = (data: any) => {
  // Business logic (e.g., validation) would go here.
  return vehicle_bridge.create_vehicle_in_db(data);
};

/**
 * Service to update a vehicle.
 */
export const update_vehicle_service = (id: string, data: any) => {
  return vehicle_bridge.update_vehicle_in_db(id, data);
};

/**
 * Service to delete a vehicle.
 */
export const delete_vehicle_service = (id: string) => {
  return vehicle_bridge.delete_vehicle_from_db(id);
};

