// File: back/src/controllers/public.controller.ts
// Last change: Switched from TaskProgressStatus to Prisma TaskStatus enum

import { Request, Response } from 'express';
import { prisma } from '../core/prisma.client.js';
import { TaskStatus } from '@prisma/client';

export const getVehicleByTrackingToken = async (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ message: 'Valid tracking token is required.' });
  }

  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { trackingToken: token },
      select: {
        id: true,
        brand: true,
        model: true,
        registration: true,
        status: true,
        entryTime: true,
        estimatedCompletion: true,
        currentStage: {
          select: {
            name: true,
            sequence: true,
            icon: true,
            color: true,
          },
        },
        customer: {
          select: {
            name: true,
          },
        },
        taskProgress: {
          include: {
            task: {
              select: {
                title: true,
                sequence: true,
              },
            },
            stage: {
              select: {
                name: true,
                sequence: true,
              },
            },
          },
          orderBy: [
            { stage: { sequence: 'asc' } },
            { task: { sequence: 'asc' } },
          ],
        },
      },
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found for the provided token.' });
    }

    const totalTasks = vehicle.taskProgress.length;
    const completedTasks = vehicle.taskProgress.filter(
      (tp) => tp.status === TaskStatus.COMPLETED
    ).length;
    const currentTasks = vehicle.taskProgress.filter(
      (tp) => tp.status === TaskStatus.IN_PROGRESS
    ).length;

    const response = {
      vehicle: {
        brand: vehicle.brand,
        model: vehicle.model,
        registration: vehicle.registration,
        status: vehicle.status,
        entryTime: vehicle.entryTime,
        estimatedCompletion: vehicle.estimatedCompletion,
        customer: vehicle.customer?.name,
      },
      currentStage: vehicle.currentStage,
      progress: {
        totalTasks,
        completedTasks,
        currentTasks,
        completionPercentage:
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
      timeline: vehicle.taskProgress.map((tp) => ({
        taskTitle: tp.task.title,
        stageName: tp.stage.name,
        status: tp.status,
        startedAt: tp.startedAt,
        completedAt: tp.completedAt,
        notes: tp.notes,
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(`[PUBLIC] Error fetching vehicle by token ${token}:`, error);
    res.status(500).json({ message: 'Failed to fetch vehicle tracking information.' });
  }
};
