// File: database/seeds/mock_data.ts
// Last change: Enhanced with system admin ghost user and complete relational structure

import type { AccessRole } from '../../common/types/access-role.types';
import { AuthMethod, MembershipStatus } from '../../common/types/auth.types';
import type { TaskProgressStatus } from '../../common/types/task.types';
import type { TaskPriority } from '../../common/types/task-priority.types';

// ====================================================================
// SYSTEM USERS (Ghost admins pre fallback)
// ====================================================================

const SYSTEM_ADMIN_USER = {
  id: 'system-admin-ghost',
  email: 'system@internal.ghost',
  name: 'System Administrator',
  password: null,
  is_verified: true,
  is_active: true,
  created_at: new Date('2025-01-01T00:00:00Z'),
  updated_at: new Date('2025-01-01T00:00:00Z'),
};

// ====================================================================
// MOCK ORGANIZATIONS
// ====================================================================

const MOCK_ORGANIZATIONS = [
  {
    id: 'mock-org-1',
    name: 'Demo Lakovna Bratislava',
    type: 'bodyshop',
    description: 'Ukážková karosárska dielňa pre demo účely',
    is_verified: true,
    created_at: new Date('2025-01-01T08:00:00Z'),
    updated_at: new Date('2025-01-01T08:00:00Z'),
  },
  {
    id: 'mock-org-2', 
    name: 'Demo Autoservis Košice',
    type: 'service',
    description: 'Ukážkový autoservis pre demo účely',
    is_verified: true,
    created_at: new Date('2025-01-01T09:00:00Z'),
    updated_at: new Date('2025-01-01T09:00:00Z'),
  },
];

// ====================================================================
// MOCK MEMBERSHIPS (System admin v každej org)
// ====================================================================

const MOCK_MEMBERSHIPS = [
  {
    id: 'mock-membership-1',
    user_id: 'system-admin-ghost',
    organization_id: 'mock-org-1',
    access_role: 'superadmin' as AccessRole,
    business_role: 'system-administrator',
    status: MembershipStatus.ACTIVE,
    auth_methods: [AuthMethod.PASSWORD],
    rfid_tag: null,
    qr_code: null,
    usb_key_id: null,
    created_at: new Date('2025-01-01T08:00:00Z'),
    updated_at: new Date('2025-01-01T08:00:00Z'),
  },
  {
    id: 'mock-membership-2',
    user_id: 'system-admin-ghost', 
    organization_id: 'mock-org-2',
    access_role: 'superadmin' as AccessRole,
    business_role: 'system-administrator',
    status: MembershipStatus.ACTIVE,
    auth_methods: [AuthMethod.PASSWORD],
    rfid_tag: null,
    qr_code: null,
    usb_key_id: null,
    created_at: new Date('2025-01-01T09:00:00Z'),
    updated_at: new Date('2025-01-01T09:00:00Z'),
  },
];

// ====================================================================
// MOCK STAGES
// ====================================================================

const MOCK_STAGES = [
  {
    id: 'mock-stage-1',
    name: 'Prijatie',
    icon: '📋',
    color_hsl: 'hsl(220, 70%, 60%)',
    category: 'A',
    sequence: 1,
    is_active: true,
    is_required: true,
    organization_id: 'mock-org-1',
    created_at: new Date('2025-01-01T08:30:00Z'),
    updated_at: new Date('2025-01-01T08:30:00Z'),
  },
  {
    id: 'mock-stage-2',
    name: 'Umývanie',
    icon: '🚿',
    color_hsl: 'hsl(200, 70%, 60%)',
    category: 'A', 
    sequence: 2,
    is_active: true,
    is_required: true,
    organization_id: 'mock-org-1',
    created_at: new Date('2025-01-01T08:31:00Z'),
    updated_at: new Date('2025-01-01T08:31:00Z'),
  },
  {
    id: 'mock-stage-3',
    name: 'Príprava',
    icon: '🛠️',
    color_hsl: 'hsl(30, 70%, 60%)',
    category: 'A',
    sequence: 3,
    is_active: true,
    is_required: true,
    organization_id: 'mock-org-1',
    created_at: new Date('2025-01-01T08:32:00Z'),
    updated_at: new Date('2025-01-01T08:32:00Z'),
  },
  {
    id: 'mock-stage-4',
    name: 'Lakovanie',
    icon: '🎨',
    color_hsl: 'hsl(350, 70%, 60%)',
    category: 'A',
    sequence: 4,
    is_active: true,
    is_required: true,
    organization_id: 'mock-org-1',
    created_at: new Date('2025-01-01T08:33:00Z'),
    updated_at: new Date('2025-01-01T08:33:00Z'),
  },
  {
    id: 'mock-stage-5',
    name: 'Dokončenie',
    icon: '✅',
    color_hsl: 'hsl(120, 70%, 60%)',
    category: 'A',
    sequence: 5,
    is_active: true,
    is_required: true,
    organization_id: 'mock-org-1',
    created_at: new Date('2025-01-01T08:34:00Z'),
    updated_at: new Date('2025-01-01T08:34:00Z'),
  },
];

// ====================================================================
// MOCK VEHICLES
// ====================================================================

const MOCK_VEHICLES = [
  {
    id: 'mock-vehicle-1',
    vin: 'TMB4C21Z9F0123456',
    brand: 'Škoda',
    model: 'Octavia',
    year: 2019,
    registration_number: 'BA123AB',
    customer_name: 'Ján Novák',
    customer_email: 'jan.novak@example.com',
    customer_phone: '+421901123456',
    is_active: true,
    notes: 'Lakovanie kapoty po nehode.',
    qr_code_token: 'qr-ba123ab-001',
    tracking_token: 'track-ba123ab-001',
    entry_time: new Date('2025-01-15T10:00:00Z'),
    estimated_completion: new Date('2025-01-17T17:00:00Z'),
    organization_id: 'mock-org-1',
    current_stage_id: 'mock-stage-2',
    created_at: new Date('2025-01-15T10:00:00Z'),
    updated_at: new Date('2025-01-16T14:30:00Z'),
  },
  {
    id: 'mock-vehicle-2',
    vin: 'WVW3C21Z9F0789012',
    brand: 'Volkswagen',
    model: 'Golf',
    year: 2020,
    registration_number: 'BL456CD',
    customer_name: 'Mária Kováčová',
    customer_email: 'maria.kovacova@example.com', 
    customer_phone: '+421902654321',
    is_active: true,
    notes: 'Kompletná oprava karosérie.',
    qr_code_token: 'qr-bl456cd-002',
    tracking_token: 'track-bl456cd-002',
    entry_time: new Date('2025-01-16T09:30:00Z'),
    estimated_completion: new Date('2025-01-20T16:00:00Z'),
    organization_id: 'mock-org-1',
    current_stage_id: 'mock-stage-1',
    created_at: new Date('2025-01-16T09:30:00Z'),
    updated_at: new Date('2025-01-16T09:30:00Z'),
  },
];

// ====================================================================
// MOCK TASKS
// ====================================================================

const MOCK_TASKS = [
  {
    id: 'mock-task-1',
    title: 'Zaevidovanie vozidla',
    sequence: 1,
    description: 'Zaevidovanie vozidla do systému, kontrola dokumentov',
    estimated_duration: 15,
    priority: 'HIGH' as TaskPriority,
    is_completed: true,
    vehicle_id: 'mock-vehicle-1',
    stage_id: 'mock-stage-1',
    created_at: new Date('2025-01-15T10:00:00Z'),
    updated_at: new Date('2025-01-15T10:15:00Z'),
  },
  {
    id: 'mock-task-2',
    title: 'Fotodokumentácia',
    sequence: 2,
    description: 'Fotenie poškodení pred začatím prác',
    estimated_duration: 10,
    priority: 'HIGH' as TaskPriority,
    is_completed: true,
    vehicle_id: 'mock-vehicle-1',
    stage_id: 'mock-stage-1',
    created_at: new Date('2025-01-15T10:15:00Z'),
    updated_at: new Date('2025-01-15T10:25:00Z'),
  },
  {
    id: 'mock-task-3',
    title: 'Predumývanie',
    sequence: 1,
    description: 'Odstránenie prachu a nečistôt z karosérie',
    estimated_duration: 20,
    priority: 'MEDIUM' as TaskPriority,
    is_completed: false,
    vehicle_id: 'mock-vehicle-1',
    stage_id: 'mock-stage-2',
    created_at: new Date('2025-01-16T08:00:00Z'),
    updated_at: new Date('2025-01-16T08:00:00Z'),
  },
];

// ====================================================================
// MOCK TASK PROGRESS
// ====================================================================

const MOCK_TASK_PROGRESS = [
  {
    id: 'mock-progress-1',
    status: 'completed' as TaskProgressStatus,
    notes: 'Vozidlo úspešne zaevidované, všetky dokumenty v poriadku.',
    started_at: new Date('2025-01-15T10:00:00Z'),
    completed_at: new Date('2025-01-15T10:15:00Z'),
    task_id: 'mock-task-1',
    worker_membership_id: 'mock-membership-1',
    created_at: new Date('2025-01-15T10:00:00Z'),
    updated_at: new Date('2025-01-15T10:15:00Z'),
  },
  {
    id: 'mock-progress-2',
    status: 'completed' as TaskProgressStatus,
    notes: 'Fotodokumentácia kompletná, 12 fotografií uložených.',
    started_at: new Date('2025-01-15T10:15:00Z'),
    completed_at: new Date('2025-01-15T10:25:00Z'),
    task_id: 'mock-task-2',
    worker_membership_id: 'mock-membership-1',
    created_at: new Date('2025-01-15T10:15:00Z'),
    updated_at: new Date('2025-01-15T10:25:00Z'),
  },
];

// ====================================================================
// EXPORT MOCK DATA
// ====================================================================

export const MOCK_DATA = {
  users: [SYSTEM_ADMIN_USER],
  organizations: MOCK_ORGANIZATIONS,
  memberships: MOCK_MEMBERSHIPS,
  stages: MOCK_STAGES,
  vehicles: MOCK_VEHICLES,
  tasks: MOCK_TASKS,
  task_progress: MOCK_TASK_PROGRESS,
} as const;

// ====================================================================
// FALLBACK HELPERS
// ====================================================================

export const get_mock_data = (table: keyof typeof MOCK_DATA) => {
  return MOCK_DATA[table] || [];
};

export const get_mock_user_by_email = (email: string) => {
  return MOCK_DATA.users.find(user => user.email === email) || null;
};

export const get_mock_vehicles_by_organization = (org_id: string) => {
  return MOCK_DATA.vehicles.filter(vehicle => vehicle.organization_id === org_id);
};

export const get_mock_stages_by_organization = (org_id: string) => {
  return MOCK_DATA.stages.filter(stage => stage.organization_id === org_id);
};