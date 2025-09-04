// File: back/src/utils/bridge-dashboard.utils.ts
// Last change: Refactored to snake_case I/O according to Bridge Layer conventions

import { prisma } from '../core/prisma.client';

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const FOUR_HOURS_IN_MS = 4 * 60 * 60 * 1000;

export async function count_all_vehicles(): Promise<number> {
  return prisma.vehicle.count();
}

export async function count_active_vehicles(): Promise<number> {
  return prisma.vehicle.count({
    where: { NOT: { current_stage: { name: 'Dokončené' } } },
  });
}

export async function count_completed_vehicles(): Promise<number> {
  return prisma.vehicle.count({ 
    where: { current_stage: { name: 'Dokončené' } } 
  });
}

export async function get_completed_vehicles_with_times(): Promise<Array<{
  entry_time: Date;
  updated_at: Date;
}>> {
  const vehicles = await prisma.vehicle.findMany({
    where: { current_stage: { name: 'Dokončené' } },
    select: { entry_time: true, updated_at: true },
  });

  return vehicles.map(vehicle => ({
    entry_time: vehicle.entry_time,
    updated_at: vehicle.updated_at,
  }));
}

export async function count_tasks_in_progress(): Promise<number> {
  return prisma.taskProgress.count({
    where: { status: 'in_progress' },
  });
}

export async function count_delayed_vehicles(): Promise<number> {
  return prisma.vehicle.count({
    where: {
      AND: [
        { is_active: true },
        { estimated_completion: { not: null } },
        { estimated_completion: { lt: new Date() } },
        { NOT: { current_stage: { name: 'Dokončené' } } }
      ]
    }
  });
}

export async function get_recent_task_activity(): Promise<Array<{
  id: string;
  task: {
    id: string;
    title: string;
    sequence: number;
  };
  stage: {
    id: string;
    name: string;
    sequence: number;
  };
  status: string;
  notes?: string;
  started_at?: Date;
  completed_at?: Date;
  vehicle_id?: string;
  vehicle?: {
    id: string;
    brand: string;
    model: string;
    registration_number: string;
  };
  worker_id?: string;
  worker?: {
    id: string;
    name: string;
  };
}>> {
  const twenty_four_hours_ago = new Date(Date.now() - ONE_DAY_IN_MS);
  
  const task_progress_data = await prisma.taskProgress.findMany({
    where: {
      OR: [
        {
          status: 'completed',
          completed_at: { gte: twenty_four_hours_ago },
        },
        {
          status: 'in_progress',
          started_at: { gte: twenty_four_hours_ago },
        },
      ],
    },
    include: {
      task: {
        include: {
          vehicle: { 
            select: { 
              id: true,
              brand: true, 
              model: true, 
              registration_number: true 
            } 
          },
          stage: { 
            select: { 
              id: true,
              name: true,
              sequence: true 
            } 
          },
        },
      },
      worker: {
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
    },
    orderBy: { created_at: 'desc' },
    take: 10,
  });

  return task_progress_data.map(item => ({
    id: item.id,
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
    status: item.status,
    notes: item.notes || undefined,
    started_at: item.started_at || undefined,
    completed_at: item.completed_at || undefined,
    vehicle_id: item.task.vehicle?.id,
    vehicle: item.task.vehicle ? {
      id: item.task.vehicle.id,
      brand: item.task.vehicle.brand,
      model: item.task.vehicle.model,
      registration_number: item.task.vehicle.registration_number,
    } : undefined,
    worker_id: item.worker?.user?.id,
    worker: item.worker?.user ? {
      id: item.worker.user.id,
      name: item.worker.user.name,
    } : undefined,
  }));
}

export async function get_stage_vehicle_counts(): Promise<Array<{
  id: string;
  name: string;
  icon?: string;
  color_hsl?: string;
  position_x?: number;
  position_y?: number;
  sequence: number;
  is_active: boolean;
  is_required: boolean;
  organization_id: string;
  tasks: Array<{
    id: string;
    title: string;
    description?: string;
    sequence: number;
    priority?: string;
    estimated_duration?: number;
    stage_id: string;
    created_at: Date;
    updated_at: Date;
  }>;
  created_at: Date;
  updated_at: Date;
  vehicle_count: number;
}>> {
  const stages_data = await prisma.stage.findMany({
    where: { is_active: true },
    select: {
      id: true,
      name: true,
      icon: true,
      color_hsl: true,
      sequence: true,
      is_active: true,
      is_required: true,
      organization_id: true,
      created_at: true,
      updated_at: true,
      _count: { select: { vehicles_in_stage: true } },
      tasks: {
        select: {
          id: true,
          title: true,
          description: true,
          sequence: true,
          priority: true,
          estimated_duration: true,
          created_at: true,
          updated_at: true,
        },
        orderBy: { sequence: 'asc' },
      },
    },
    orderBy: { sequence: 'asc' },
  });

  return stages_data.map(stage => ({
    id: stage.id,
    name: stage.name,
    icon: stage.icon || undefined,
    color_hsl: stage.color_hsl || undefined,
    position_x: undefined, // Not in current schema
    position_y: undefined, // Not in current schema
    sequence: stage.sequence,
    is_active: stage.is_active,
    is_required: stage.is_required,
    organization_id: stage.organization_id,
    tasks: stage.tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      sequence: task.sequence,
      priority: task.priority || undefined,
      estimated_duration: task.estimated_duration || undefined,
      stage_id: stage.id,
      created_at: task.created_at,
      updated_at: task.updated_at,
    })),
    created_at: stage.created_at,
    updated_at: stage.updated_at,
    vehicle_count: stage._count.vehicles_in_stage,
  }));
}

export async function get_delayed_vehicles(): Promise<Array<{
  brand: string;
  model: string;
  registration_number: string;
  estimated_completion: Date | null;
  customer_name: string;
  current_stage: { name: string } | null;
}>> {
  const vehicles = await prisma.vehicle.findMany({
    where: {
      AND: [
        { is_active: true },
        { estimated_completion: { not: null } },
        { estimated_completion: { lt: new Date() } },
        { NOT: { current_stage: { name: 'Dokončené' } } }
      ]
    },
    select: {
      brand: true,
      model: true,
      registration_number: true,
      estimated_completion: true,
      customer_name: true,
      current_stage: {
        select: {
          name: true
        }
      }
    }
  });

  return vehicles.map(vehicle => ({
    brand: vehicle.brand,
    model: vehicle.model,
    registration_number: vehicle.registration_number,
    estimated_completion: vehicle.estimated_completion,
    customer_name: vehicle.customer_name,
    current_stage: vehicle.current_stage,
  }));
}

export async function get_stuck_tasks(): Promise<Array<{
  id: string;
  status: string;
  started_at: Date | null;
  task: {
    id: string;
    title: string;
    vehicle?: {
      brand: string;
      model: string;
      registration_number: string;
    };
  };
  worker?: {
    id: string;
    name: string;
  };
}>> {
  const four_hours_ago = new Date(Date.now() - FOUR_HOURS_IN_MS);
  
  const stuck_tasks = await prisma.taskProgress.findMany({
    where: {
      status: 'in_progress',
      started_at: { lte: four_hours_ago },
    },
    include: {
      task: {
        include: {
          vehicle: { 
            select: { 
              brand: true, 
              model: true, 
              registration_number: true 
            } 
          },
        },
      },
      worker: {
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
    },
  });

  return stuck_tasks.map(item => ({
    id: item.id,
    status: item.status,
    started_at: item.started_at,
    task: {
      id: item.task.id,
      title: item.task.title,
      vehicle: item.task.vehicle ? {
        brand: item.task.vehicle.brand,
        model: item.task.vehicle.model,
        registration_number: item.task.vehicle.registration_number,
      } : undefined,
    },
    worker: item.worker?.user ? {
      id: item.worker.user.id,
      name: item.worker.user.name,
    } : undefined,
  }));
}