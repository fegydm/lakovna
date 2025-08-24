// File: back/src/controllers/vehicle.controller.ts
// Last change: Fixed imports to use unified prisma client

import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: { customer: true, currentStage: true },
    });
    res.status(200).json(vehicles);
  } catch (error) {
    console.error('[VEHICLE] Error fetching vehicles:', error);
    res.status(500).json({ message: 'Failed to fetch vehicles.' });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: { customer: true, currentStage: true, taskProgress: true },
    });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    console.error(`[VEHICLE] Error fetching vehicle ${id}:`, error);
    res.status(500).json({ message: 'Failed to fetch vehicle.' });
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  const { brand, model, registration, customerId } = req.body;
  if (!brand || !model || !registration || !customerId) {
    return res.status(400).json({ message: 'Brand, model, registration, and customerId are required.' });
  }

  try {
    const newVehicle = await prisma.vehicle.create({
      data: req.body,
    });
    res.status(201).json(newVehicle);
  } catch (error) {
    console.error('[VEHICLE] Error creating vehicle:', error);
    res.status(500).json({ message: 'Failed to create vehicle.' });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json(updatedVehicle);
  } catch (error) {
    console.error(`[VEHICLE] Error updating vehicle ${id}:`, error);
    res.status(500).json({ message: 'Failed to update vehicle.' });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.vehicle.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(`[VEHICLE] Error deleting vehicle ${id}:`, error);
    res.status(500).json({ message: 'Failed to delete vehicle.' });
  }
};