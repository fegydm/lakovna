// File: back/src/controllers/vehicle.controller.ts
// Last change: Refactored to remove direct Prisma access and align with conventions.

import { Request, Response } from 'express';
import * as vehicle_service from '../services/vehicle.service';

// Helper to convert object keys to camelCase for API responses.
const to_camel_case = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => to_camel_case(v));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camel_key = key.replace(/([-_][a-z])/gi, ($1) =>
        $1.toUpperCase().replace('-', '').replace('_', '')
      );
      acc[camel_key] = to_camel_case(obj[key]);
      return acc;
    }, {} as { [key: string]: any });
  }
  return obj;
};


export const get_all_vehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicle_service.get_all_vehicles_service();
    res.status(200).json(to_camel_case(vehicles));
  } catch (error) {
    console.error('[VEHICLE] Error fetching vehicles:', error);
    res.status(500).json({ message: 'Failed to fetch vehicles.' });
  }
};

export const get_vehicle_by_id = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const vehicle = await vehicle_service.get_vehicle_by_id_service(id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' });
    }
    res.status(200).json(to_camel_case(vehicle));
  } catch (error) {
    console.error(`[VEHICLE] Error fetching vehicle ${id}:`, error);
    res.status(500).json({ message: 'Failed to fetch vehicle.' });
  }
};

export const create_vehicle = async (req: Request, res: Response) => {
  // Assuming frontend sends camelCase keys, which Prisma handles gracefully.
  const { brand, model, registrationNumber, customerId } = req.body;
  if (!brand || !model || !registrationNumber || !customerId) {
    return res.status(400).json({ message: 'brand, model, registrationNumber, and customerId are required.' });
  }

  try {
    // The service layer expects data that can be passed to Prisma.
    // req.body can be passed directly if keys match what Prisma expects.
    const new_vehicle = await vehicle_service.create_vehicle_service(req.body);
    res.status(201).json(to_camel_case(new_vehicle));
  } catch (error) {
    console.error('[VEHICLE] Error creating vehicle:', error);
    res.status(500).json({ message: 'Failed to create vehicle.' });
  }
};

export const update_vehicle = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updated_vehicle = await vehicle_service.update_vehicle_service(id, req.body);
    res.status(200).json(to_camel_case(updated_vehicle));
  } catch (error) {
    console.error(`[VEHICLE] Error updating vehicle ${id}:`, error);
    res.status(500).json({ message: 'Failed to update vehicle.' });
  }
};

export const delete_vehicle = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await vehicle_service.delete_vehicle_service(id);
    res.status(204).send();
  } catch (error) {
    console.error(`[VEHICLE] Error deleting vehicle ${id}:`, error);
    res.status(500).json({ message: 'Failed to delete vehicle.' });
  }
};
