// File: back/src/controllers/dashboard.controller.ts
// Last change: Fixed missing types in reduce/map callbacks (no implicit any)

import { Request, Response } from 'express';
import { prisma } from '../core/prisma.client.js';
import type { VehicleStatus, VehicleInfo } from 'common/types/vehicle.types';
import type { TaskStatus } from 'common/types/stage.types';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [
      totalVehicles,
      activeVehicles,
      delayedVehicles,
      completedVehicles,
      totalWorkers,
      activeWorkers,
      stageStats,
      recentActivity,
      completedVehiclesData
    ] = await Promise.all([
      prisma.vehicle.count(),

      prisma.vehicle.count({
        where: {
          status: { notIn: ['COMPLETED'] as VehicleStatus[] }
        }
      }),

      prisma.vehicle.count({
        where: { status: 'DELAYED' as VehicleStatus }
      }),

      prisma.vehicle.count({
        where: { status: 'COMPLETED' as VehicleStatus }
      }),

      prisma.worker.count(),

      prisma.worker.count({
        where: { isActive: true }
      }),

      prisma.stage.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          sequence: true,
          color: true,
          _count: {
            select: { vehicles: true }
          }
        },
        orderBy: { sequence: 'asc' }
      }),

      prisma.taskProgress.findMany({
        where: {
          OR: [
            {
              status: 'COMPLETED' as TaskStatus,
              completedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            },
            {
              status: 'IN_PROGRESS' as TaskStatus,
              startedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            }
          ]
        },
        include: {
          vehicle: { select: { brand: true, model: true, registration: true } },
          task: { select: { title: true } },
          stage: { select: { name: true } },
          worker: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      prisma.vehicle.findMany({
        where: { status: 'COMPLETED' as VehicleStatus },
        select: { entryTime: true, updatedAt: true }
      })
    ]);

    const totalTasksInProgress = await prisma.taskProgress.count({
      where: { status: 'IN_PROGRESS' as TaskStatus }
    });

    const averageCompletionHours =
      completedVehiclesData.length > 0
        ? completedVehiclesData.reduce(
            (acc: number, vehicle: { entryTime: Date; updatedAt: Date }) => {
              if (vehicle.updatedAt && vehicle.entryTime) {
                const hours =
                  (vehicle.updatedAt.getTime() - vehicle.entryTime.getTime()) /
                  (1000 * 60 * 60);
                return acc + hours;
              }
              return acc;
            },
            0
          ) / completedVehiclesData.length
        : 0;

    const stats = {
      vehicles: {
        total: totalVehicles,
        active: activeVehicles,
        completed: completedVehicles,
        delayed: delayedVehicles,
        completionRate:
          totalVehicles > 0
            ? Math.round((completedVehicles / totalVehicles) * 100)
            : 0
      },
      workers: {
        total: totalWorkers,
        active: activeWorkers,
        utilization:
          totalWorkers > 0
            ? Math.round((activeWorkers / totalWorkers) * 100)
            : 0
      },
      stages: stageStats.map((stage: typeof stageStats[number]) => ({
        id: stage.id,
        name: stage.name,
        sequence: stage.sequence,
        color: stage.color,
        vehicleCount: stage._count.vehicles,
        utilization: Math.round(
          (stage._count.vehicles / Math.max(activeVehicles, 1)) * 100
        )
      })),
      tasks: {
        inProgress: totalTasksInProgress,
        completedToday: recentActivity.filter(
          (a: typeof recentActivity[number]) =>
            a.status === ('COMPLETED' as TaskStatus)
        ).length
      },
      recentActivity: recentActivity.map((activity: typeof recentActivity[number]) => ({
        id: activity.id,
        vehicle: `${activity.vehicle.brand} ${activity.vehicle.model} (${activity.vehicle.registration})`,
        task: activity.task.title,
        stage: activity.stage.name,
        worker: activity.worker?.name || 'Unassigned',
        status: activity.status,
        timestamp:
          activity.status === ('COMPLETED' as TaskStatus)
            ? activity.completedAt
            : activity.startedAt
      })),
      performance: {
        averageCompletionHours: parseFloat(averageCompletionHours.toFixed(2)),
        throughput:
          totalVehicles > 0
            ? Math.round((completedVehicles / totalVehicles) * 100)
            : 0
      }
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('[DASHBOARD] Error fetching stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats.' });
  }
};

export const getDashboardAlerts = async (req: Request, res: Response) => {
  try {
    interface Alert {
      type: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      message: string;
      data: any;
    }

    const alerts: Alert[] = [];

    const delayedVehicles = await prisma.vehicle.findMany({
      where: { status: 'DELAYED' as VehicleStatus },
      select: {
        id: true,
        brand: true,
        model: true,
        registration: true,
        estimatedCompletion: true,
        currentStage: { select: { name: true } }
      }
    });

    const stuckTasks = await prisma.taskProgress.findMany({
      where: {
        status: 'IN_PROGRESS' as TaskStatus,
        startedAt: { lte: new Date(Date.now() - 4 * 60 * 60 * 1000) }
      },
      include: {
        vehicle: { select: { brand: true, model: true, registration: true } },
        task: { select: { title: true } },
        worker: { select: { name: true } }
      }
    });

    delayedVehicles.forEach((vehicle: typeof delayedVehicles[number]) => {
      alerts.push({
        type: 'delayed_vehicle',
        severity: 'high',
        message: `Vehicle ${vehicle.brand} ${vehicle.model} (${vehicle.registration}) is delayed`,
        data: vehicle
      });
    });

    stuckTasks.forEach((task: typeof stuckTasks[number]) => {
      alerts.push({
        type: 'stuck_task',
        severity: 'medium',
        message: `Task "${task.task.title}" has been in progress for over 4 hours`,
        data: {
          vehicle: `${task.vehicle.brand} ${task.vehicle.model} (${task.vehicle.registration})`,
          worker: task.worker?.name,
          startedAt: task.startedAt
        }
      });
    });

    res.status(200).json(alerts);
  } catch (error) {
    console.error('[DASHBOARD] Error fetching alerts:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard alerts.' });
  }
};
