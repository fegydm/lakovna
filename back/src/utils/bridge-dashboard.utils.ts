// File: back/src/utils/bridge-dashboard.utils.ts
// Last change: Final, complete version with path alias and full function bodies.

import { prisma } from '../core/prisma.client';
import { TaskProgressStatus } from '@prisma/client'; // ZMENA: Používame robustný alias
import { SYSTEM_STAGE_KEYS } from 'common/configs/01-constants.config';
import type {
  CompletedVehicleTime,
  DelayedVehicleInfo,
  RecentTaskActivity,
  StageVehicleCount,
  StuckTaskInfo,
} from 'common/types/dashboard.types';

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const FOUR_HOURS_IN_MS = 4 * 60 * 60 * 1000;

// --- Vehicle Counts ---

export async function countAllVehicles(): Promise<number> {
  return prisma.vehicle.count();
}

export async function countActiveVehicles(): Promise<number> {
  return prisma.vehicle.count({
    where: { NOT: { currentStage: { key: SYSTEM_STAGE_KEYS.COMPLETED } } },
  });
}

export async function countCompletedVehicles(): Promise<number> {
  return prisma.vehicle.count({
    where: { currentStage: { key: SYSTEM_STAGE_KEYS.COMPLETED } },
  });
}

export async function countDelayedVehicles(): Promise<number> {
  return prisma.vehicle.count({
    where: {
      estimatedCompletion: { lt: new Date() },
      NOT: { currentStage: { key: SYSTEM_STAGE_KEYS.COMPLETED } },
    },
  });
}

// --- Task Counts ---

export async function countTasksInProgress(): Promise<number> {
  return prisma.taskProgress.count({
    where: { status: TaskProgressStatus.IN_PROGRESS },
  });
}

// --- Data Fetching & Transformation ---

export async function getCompletedVehiclesWithTimes(): Promise<CompletedVehicleTime[]> {
  const vehicles = await prisma.vehicle.findMany({
    where: { currentStage: { key: SYSTEM_STAGE_KEYS.COMPLETED } },
    select: { entryTime: true, updatedAt: true },
  });
  return vehicles;
}

export async function getStageVehicleCounts(): Promise<StageVehicleCount[]> {
  const stagesFromDb = await prisma.stage.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      icon: true,
      colorHsl: true,
      sequence: true,
      _count: { select: { vehiclesInStage: true } },
      tasks: {
        select: { id: true, title: true, priority: true },
        orderBy: { sequence: 'asc' },
      },
    },
    orderBy: { sequence: 'asc' },
  });

  return stagesFromDb.map((stage) => ({
    id: stage.id,
    name: stage.name,
    icon: stage.icon ?? undefined,
    colorHsl: stage.colorHsl ?? undefined,
    sequence: stage.sequence,
    vehicleCount: stage._count.vehiclesInStage,
    tasks: stage.tasks.map((task) => ({
      id: task.id,
      title: task.title,
      priority: task.priority ?? undefined,
    })),
  }));
}

export async function getDelayedVehicles(): Promise<DelayedVehicleInfo[]> {
  const vehiclesFromDb = await prisma.vehicle.findMany({
    where: {
      estimatedCompletion: { lt: new Date() },
      NOT: { currentStage: { key: SYSTEM_STAGE_KEYS.COMPLETED } },
    },
    select: {
      brand: true,
      model: true,
      registrationNumber: true,
      estimatedCompletion: true,
      customerName: true,
      currentStage: { select: { name: true } },
    },
  });

  return vehiclesFromDb.map((vehicle) => ({
    brand: vehicle.brand,
    model: vehicle.model,
    registrationNumber: vehicle.registrationNumber,
    estimatedCompletion: vehicle.estimatedCompletion,
    customerName: vehicle.customerName,
    currentStageName: vehicle.currentStage?.name ?? null,
  }));
}

export async function getStuckTasks(): Promise<StuckTaskInfo[]> {
  const fourHoursAgo = new Date(Date.now() - FOUR_HOURS_IN_MS);
  const stuckTasksFromDb = await prisma.taskProgress.findMany({
    where: {
      status: TaskProgressStatus.IN_PROGRESS,
      startedAt: { lte: fourHoursAgo },
    },
    select: {
      id: true,
      status: true,
      startedAt: true,
      task: {
        select: {
          title: true,
          vehicle: {
            select: { brand: true, model: true, registrationNumber: true },
          },
        },
      },
      worker: { select: { user: { select: { name: true } } } },
    },
  });

  return stuckTasksFromDb.map((item) => ({
    id: item.id,
    status: item.status,
    startedAt: item.startedAt,
    taskTitle: item.task.title,
    vehicleInfo: item.task.vehicle
      ? `${item.task.vehicle.brand} ${item.task.vehicle.model} (${item.task.vehicle.registrationNumber})`
      : undefined,
    workerName: item.worker?.user.name,
  }));
}

export async function getRecentTaskActivity(): Promise<RecentTaskActivity[]> {
  const twentyFourHoursAgo = new Date(Date.now() - ONE_DAY_IN_MS);
  const activityFromDb = await prisma.taskProgress.findMany({
    where: {
      OR: [
        {
          status: TaskProgressStatus.COMPLETED,
          completedAt: { gte: twentyFourHoursAgo },
        },
        {
          status: TaskProgressStatus.IN_PROGRESS,
          startedAt: { gte: twentyFourHoursAgo },
        },
      ],
    },
    select: {
      id: true,
      status: true,
      notes: true,
      startedAt: true,
      completedAt: true,
      task: {
        select: {
          id: true,
          title: true,
          sequence: true,
          stage: { select: { id: true, name: true, sequence: true } },
          vehicle: { select: { id: true, brand: true, model: true, registrationNumber: true } },
        },
      },
      worker: { select: { user: { select: { id: true, name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return activityFromDb.map((item) => ({
    id: item.id,
    status: item.status,
    notes: item.notes ?? undefined,
    startedAt: item.startedAt ?? undefined,
    completedAt: item.completedAt ?? undefined,
    task: {
      id: item.task.id,
      title: item.task.title,
      sequence: item.task.sequence,
    },
    stage: {
      id: item.task.stage.id,
      name: item.task.stage.name,
      sequence: item.task.stage.sequence,
    },
    vehicle: item.task.vehicle
      ? {
          id: item.task.vehicle.id,
          brand: item.task.vehicle.brand,
          model: item.task.vehicle.model,
          registrationNumber: item.task.vehicle.registrationNumber,
        }
      : undefined,
    worker: item.worker?.user
      ? {
          id: item.worker.user.id,
          name: item.worker.user.name,
        }
      : undefined,
  }));
}