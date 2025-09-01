// File: back/src/controllers/stage.controller.ts
// Last change: Fixed imports and improved validation with error handling

import { Request, Response } from 'express';
import { prisma } from '../core/prisma.client.js';

export const getAllStages = async (req: Request, res: Response) => {
  try {
    const stages = await prisma.stage.findMany({
      where: { isActive: true },
      orderBy: { sequence: 'asc' },
      include: { 
        tasks: { 
          orderBy: { sequence: 'asc' } 
        } 
      },
    });
    res.status(200).json(stages);
  } catch (error) {
    console.error('[STAGE] Error fetching stages:', error);
    res.status(500).json({ message: 'Failed to fetch stages.' });
  }
};

export const getStageById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const stageId = parseInt(id, 10);
  
  if (isNaN(stageId)) {
    return res.status(400).json({ message: 'Invalid stage ID.' });
  }
  
  try {
    const stage = await prisma.stage.findUnique({
      where: { id: stageId },
      include: { 
        tasks: { 
          orderBy: { sequence: 'asc' } 
        },
        vehicles: {
          select: { id: true, brand: true, model: true, registration: true }
        }
      },
    });
    
    if (!stage) {
      return res.status(404).json({ message: 'Stage not found.' });
    }
    
    res.status(200).json(stage);
  } catch (error) {
    console.error(`[STAGE] Error fetching stage ${id}:`, error);
    res.status(500).json({ message: 'Failed to fetch stage.' });
  }
};

export const createStage = async (req: Request, res: Response) => {
  const { name, icon, color, positionX, positionY, sequence } = req.body;
  
  if (!name || !icon || !color || positionX === undefined || positionY === undefined || sequence === undefined) {
    return res.status(400).json({ message: 'All fields are required for creating a stage.' });
  }

  if (typeof positionX !== 'number' || typeof positionY !== 'number' || typeof sequence !== 'number') {
    return res.status(400).json({ message: 'Position and sequence must be numbers.' });
  }

  try {
    const existingStage = await prisma.stage.findUnique({ 
      where: { sequence } 
    });
    
    if (existingStage) {
      return res.status(409).json({ message: 'A stage with this sequence already exists.' });
    }

    const newStage = await prisma.stage.create({
      data: {
        name,
        icon,
        color,
        positionX,
        positionY,
        sequence,
        isActive: true
      },
      include: { 
        tasks: { 
          orderBy: { sequence: 'asc' } 
        } 
      }
    });
    
    res.status(201).json(newStage);
  } catch (error) {
    console.error('[STAGE] Error creating stage:', error);
    
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return res.status(409).json({ message: 'Stage sequence must be unique.' });
    }
    
    res.status(500).json({ message: 'Failed to create stage.' });
  }
};

export const updateStage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const stageId = parseInt(id, 10);
  
  if (isNaN(stageId)) {
    return res.status(400).json({ message: 'Invalid stage ID.' });
  }

  try {
    const existingStage = await prisma.stage.findUnique({
      where: { id: stageId }
    });
    
    if (!existingStage) {
      return res.status(404).json({ message: 'Stage not found.' });
    }

    const updatedStage = await prisma.stage.update({
      where: { id: stageId },
      data: req.body,
      include: { 
        tasks: { 
          orderBy: { sequence: 'asc' } 
        } 
      }
    });
    
    res.status(200).json(updatedStage);
  } catch (error) {
    console.error(`[STAGE] Error updating stage ${id}:`, error);
    
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return res.status(409).json({ message: 'Stage sequence must be unique.' });
    }
    
    res.status(500).json({ message: 'Failed to update stage.' });
  }
};

export const deleteStage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const stageId = parseInt(id, 10);
  
  if (isNaN(stageId)) {
    return res.status(400).json({ message: 'Invalid stage ID.' });
  }

  try {
    const stageWithVehicles = await prisma.stage.findUnique({
      where: { id: stageId },
      include: { vehicles: true }
    });
    
    if (!stageWithVehicles) {
      return res.status(404).json({ message: 'Stage not found.' });
    }
    
    if (stageWithVehicles.vehicles.length > 0) {
      return res.status(409).json({ 
        message: 'Cannot delete stage with vehicles. Move vehicles first.' 
      });
    }

    await prisma.stage.delete({
      where: { id: stageId },
    });
    
    res.status(204).send();
  } catch (error) {
    console.error(`[STAGE] Error deleting stage ${id}:`, error);
    res.status(500).json({ message: 'Failed to delete stage.' });
  }
};