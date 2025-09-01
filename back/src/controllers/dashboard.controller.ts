// File: back/src/controllers/dashboard.controller.ts
// Last change: Fixed TypeScript errors with proper field names and type definitions

import { Request, Response } from 'express';
import { prisma } from '../clients/prisma.js';
import { VehicleStatus, TaskStatus } from '@prisma/client';

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
      completedVehiclesData // FIX: Added the missing query for this variable below
    ] = await Promise.all([
      prisma.vehicle.count(),

      prisma.vehicle.count({
        where: {
          status: { notIn: [VehicleStatus.COMPLETED] }
        }
      }),

      prisma.vehicle.count({
        where: { status: VehicleStatus.DELAYED }
      }),

      prisma.vehicle.count({
        where: { status: VehicleStatus.COMPLETED }
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
            { status: TaskStatus.COMPLETED, completedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
            { status: TaskStatus.IN_PROGRESS, startedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
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
      
      // FIX: Added the query to fetch data needed for 'averageCompletionHours' calculation
      prisma.vehicle.findMany({
        where: { 
          status: VehicleStatus.COMPLETED,
          entryTime: { lte: new Date() }, 
          updatedAt: { lte: new Date() }  
        },
        select: { entryTime: true, updatedAt: true }
      })
    ]);

    const totalTasksInProgress = await prisma.taskProgress.count({
      where: { status: TaskStatus.IN_PROGRESS }
    });
    
    // FIX: This calculation now correctly uses 'completedVehiclesData' from Promise.all
    const averageCompletionHours = completedVehiclesData.length > 0
      ? completedVehiclesData.reduce((acc, vehicle) => {
          // Ensure both dates are valid before calculation
          if (vehicle.updatedAt && vehicle.entryTime) {
            const hours = (vehicle.updatedAt.getTime() - vehicle.entryTime.getTime()) / (1000 * 60 * 60);
            return acc + hours;
          }
          return acc;
        }, 0) / completedVehiclesData.length
      : 0;

    const stats = {
      vehicles: {
        total: totalVehicles,
        active: activeVehicles,
        completed: completedVehicles,
        delayed: delayedVehicles,
        completionRate: totalVehicles > 0 ? Math.round((completedVehicles / totalVehicles) * 100) : 0
      },
      workers: {
        total: totalWorkers,
        active: activeWorkers,
        // Using totalWorkers in denominator to measure utilization of the entire workforce
        utilization: totalWorkers > 0 ? Math.round((activeWorkers / totalWorkers) * 100) : 0
      },
      stages: stageStats.map(stage => ({
        id: stage.id,
        name: stage.name,
        sequence: stage.sequence,
        color: stage.color,
        vehicleCount: stage._count.vehicles,
        utilization: Math.round((stage._count.vehicles / Math.max(activeVehicles, 1)) * 100)
      })),
      tasks: {
        inProgress: totalTasksInProgress,
        completedToday: recentActivity.filter(a => a.status === TaskStatus.COMPLETED).length
      },
      recentActivity: recentActivity.map(activity => ({
        id: activity.id,
        vehicle: `${activity.vehicle.brand} ${activity.vehicle.model} (${activity.vehicle.registration})`,
        task: activity.task.title,
        stage: activity.stage.name,
        worker: activity.worker?.name || 'Unassigned',
        status: activity.status,
        timestamp: activity.status === TaskStatus.COMPLETED ? activity.completedAt : activity.startedAt
      })),
      // FIX: Corrected syntax and logic for the performance object
      performance: {
        averageCompletionHours: parseFloat(averageCompletionHours.toFixed(2)),
        throughput: totalVehicles > 0 ? Math.round((completedVehicles / totalVehicles) * 100) : 0
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
      where: { status: VehicleStatus.DELAYED },
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
        status: TaskStatus.IN_PROGRESS,
        startedAt: { lte: new Date(Date.now() - 4 * 60 * 60 * 1000) } // In progress for more than 4 hours
      },
      include: {
        vehicle: { select: { brand: true, model: true, registration: true } },
        task: { select: { title: true } },
        worker: { select: { name: true } }
      }
    });

    delayedVehicles.forEach(vehicle => {
      alerts.push({
        type: 'delayed_vehicle',
        severity: 'high',
        message: `Vehicle ${vehicle.brand} ${vehicle.model} (${vehicle.registration}) is delayed`,
        data: vehicle
      });
    });

    stuckTasks.forEach(task => {
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