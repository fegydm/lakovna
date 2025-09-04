// File: back/src/services/dashboard.service.ts
// Last change: Hardened typings and null-safety; fixed potential shape mismatches

import {
  count_all_vehicles,
  count_active_vehicles,
  count_completed_vehicles,
  count_delayed_vehicles,
  get_completed_vehicles_with_times,
  count_tasks_in_progress,
  get_recent_task_activity,
  get_stage_vehicle_counts,
  get_delayed_vehicles,
  get_stuck_tasks,
} from '../utils/bridge-dashboard.utils';

// =============================================================
// DTOs (kept explicit for API stability)
// =============================================================
export interface VehicleStatsDTO {
  total: number;
  active: number;
  completed: number;
  delayed: number;
  completion_rate: number; // percentage 0-100
}

export interface StageStatsDTO {
  id: string;
  name: string;
  sequence: number;
  color: string | null;
  vehicle_count: number;
  utilization: number; // percentage 0-100
}

export interface TaskStatsDTO {
  in_progress: number;
  completed_today: number;
}

export interface RecentActivityDTO {
  id: string;
  vehicle: string;
  task: string;
  stage: string;
  worker: string;
  status: string;
  timestamp: Date | null;
}

export interface PerformanceStatsDTO {
  average_completion_hours: number;
  throughput: number; // mirrors completion_rate for now
}

export interface DashboardStatsDTO {
  vehicles: VehicleStatsDTO;
  stages: StageStatsDTO[];
  tasks: TaskStatsDTO;
  recent_activity: RecentActivityDTO[];
  performance: PerformanceStatsDTO;
}

export interface AlertDTO {
  type: 'delayed_vehicle' | 'stuck_task';
  severity: 'high' | 'medium';
  message: string;
  data: any; // keep flexible for UI linking
}

// =============================================================
// Utility/interop types to match utils' return shapes defensively
// =============================================================

// Completed vehicles used for avg completion calculation
interface CompletedVehicle {
  entry_time: Date;
  updated_at: Date;
}

// Stage payload may arrive with either `_count.vehicles_in_stage` or `vehicles_in_stage`
interface StageCountRaw {
  id: string;
  name: string;
  sequence: number;
  color_hsl?: string | null;
  vehicles_in_stage?: number;
  _count?: { vehicles_in_stage?: number };
}

// Recent activity raw shape (defensive optional chaining)
interface RecentActivityRaw {
  id: string;
  task: {
    title: string;
    stage?: { name?: string } | null;
    vehicle?: {
      brand?: string | null;
      model?: string | null;
      registration_number?: string | null;
    } | null;
  };
  worker?: { id?: string | null } | null;
  status: string;
  completed_at?: Date | null;
  started_at?: Date | null;
}

// Delayed vehicle raw
interface DelayedVehicleRaw {
  brand?: string | null;
  model?: string | null;
  registration_number?: string | null;
}

// Stuck task raw
interface StuckTaskRaw {
  task: {
    title?: string | null;
    vehicle?: {
      brand?: string | null;
      model?: string | null;
      registration_number?: string | null;
    } | null;
  };
  worker?: { id?: string | null } | null;
  started_at?: Date | null;
}

// =============================================================
// Helpers
// =============================================================

/** Compute average completion hours from entry_time -> updated_at. */
function calculateAverageCompletion(vehicles: CompletedVehicle[]): number {
  if (!vehicles || vehicles.length === 0) return 0;
  const total_hours = vehicles.reduce((acc, v) => {
    const start = v.entry_time instanceof Date ? v.entry_time : new Date(v.entry_time);
    const end = v.updated_at instanceof Date ? v.updated_at : new Date(v.updated_at);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return acc + (isFinite(hours) ? hours : 0);
  }, 0);
  return Number((total_hours / Math.max(vehicles.length, 1)).toFixed(2));
}

/** Safe percent, rounded to whole number. */
function pct(completed: number, total: number): number {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

/** Build a human-friendly vehicle label. */
function labelVehicle(v?: { brand?: string | null; model?: string | null; registration_number?: string | null } | null): string {
  if (!v) return 'Unknown vehicle';
  const brand = v.brand?.trim() || 'Unknown';
  const model = v.model?.trim() || '';
  const reg = v.registration_number?.trim() || '—';
  return `${brand}${model ? ' ' + model : ''} (${reg})`;
}

// =============================================================
// STATS
// =============================================================
export async function get_dashboard_stats_service(): Promise<DashboardStatsDTO> {
  const [
    total_vehicles,
    active_vehicles,
    completed_vehicles,
    delayed_vehicles,
    completed_vehicles_data,
    total_tasks_in_progress,
    recent_activity_raw,
    stage_stats_raw,
  ] = await Promise.all([
    count_all_vehicles(),
    count_active_vehicles(),
    count_completed_vehicles(),
    count_delayed_vehicles(),
    get_completed_vehicles_with_times(),
    count_tasks_in_progress(),
    get_recent_task_activity(),
    get_stage_vehicle_counts(),
  ]);

  const average_completion_hours = calculateAverageCompletion((completed_vehicles_data ?? []) as CompletedVehicle[]);

  // Normalize stage stats to a consistent structure
  const stages: StageStatsDTO[] = (stage_stats_raw as StageCountRaw[]).map((stage) => {
    const vehicleCount = typeof stage.vehicles_in_stage === 'number'
      ? stage.vehicles_in_stage
      : stage._count?.vehicles_in_stage ?? 0;

    const utilization = pct(vehicleCount, Math.max(active_vehicles ?? 0, 1));

    return {
      id: String(stage.id),
      name: stage.name ?? '',
      sequence: Number(stage.sequence ?? 0),
      color: stage.color_hsl ?? null,
      vehicle_count: Number(vehicleCount ?? 0),
      utilization,
    };
  });

  // Normalize recent activity
  const recent_activity: RecentActivityDTO[] = (recent_activity_raw as RecentActivityRaw[]).map((a) => {
    const vehicle_info = labelVehicle(a.task?.vehicle ?? null);
    const task_info = a.task?.title ?? 'Untitled task';
    const stage_info = a.task?.stage?.name ?? 'Unknown stage';
    const worker_info = a.worker?.id ?? 'unassigned';
    const timestamp = a.status === 'completed' ? (a.completed_at ?? null) : (a.started_at ?? null);

    return {
      id: String(a.id),
      vehicle: vehicle_info,
      task: task_info,
      stage: stage_info,
      worker: worker_info,
      status: a.status,
      timestamp,
    };
  });

  return {
    vehicles: {
      total: Number(total_vehicles ?? 0),
      active: Number(active_vehicles ?? 0),
      completed: Number(completed_vehicles ?? 0),
      delayed: Number(delayed_vehicles ?? 0),
      completion_rate: pct(Number(completed_vehicles ?? 0), Number(total_vehicles ?? 0)),
    },
    stages,
    tasks: {
      in_progress: Number(total_tasks_in_progress ?? 0),
      completed_today: recent_activity.filter((a) => a.status === 'completed').length,
    },
    recent_activity,
    performance: {
      average_completion_hours,
      throughput: pct(Number(completed_vehicles ?? 0), Number(total_vehicles ?? 0)),
    },
  };
}

// =============================================================
// ALERTS
// =============================================================
export async function get_dashboard_alerts_service(): Promise<AlertDTO[]> {
  const [delayed_raw, stuck_raw] = await Promise.all([
    get_delayed_vehicles(),
    get_stuck_tasks(),
  ]);

  const alerts: AlertDTO[] = [];

  // Delayed vehicles → high severity
  (delayed_raw as DelayedVehicleRaw[]).forEach((vehicle) => {
    alerts.push({
      type: 'delayed_vehicle',
      severity: 'high',
      message: `Vozidlo ${labelVehicle(vehicle)} mešká.`,
      data: vehicle,
    });
  });

  // Stuck tasks → medium severity
  (stuck_raw as StuckTaskRaw[]).forEach((task) => {
    const vehicle_info = labelVehicle(task.task?.vehicle ?? null);
    alerts.push({
      type: 'stuck_task',
      severity: 'medium',
      message: `Úloha "${task.task?.title ?? 'Untitled task'}" je v riešení dlhšie ako 4 hodiny.`,
      data: {
        vehicle: vehicle_info,
        worker: task.worker?.id ?? 'unassigned',
        started_at: task.started_at ?? null,
      },
    });
  });

  return alerts;
}
