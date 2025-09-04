// File: common/types/project.types.ts
// Last change: Updated imports to reflect the new config structure and added AuthStatus type.

import {
  ACCESS_ROLES,
  AUTH_METHODS,
  AUTH_STATUSES,
  GROUPED_LANGUAGE_TYPES,
  LOG_LEVELS,
  MEMBERSHIP_STATUSES,
  PROJECT_CATEGORIES,
  PROJECT_ORG_TYPES,
  PROTECTED_RESOURCE_TYPES,
  TASK_PRIORITIES,
  TASK_PROGRESS_STATUSES,
  ZODIAC_SIGNS,
} from '../configs/01-constants.config';
import { PROJECT_COLOR_CONFIG } from '../configs/02-colors.config';
import { APP_CONFIG } from '../configs/03-app.config';
import { UI_CONFIG } from '../configs/04-ui.config';
import { I18N_CONFIG } from '../configs/05-i18n.config';
import { PROJECT_CONFIG } from '../configs/project.config';

export interface Invite {
  id: string;
  organizationId: string;
  email: string;
  accessRole: AccessRole;
  token: string;
  expiresAt: Date;
}

export type IsoDateString = string;

export interface ApiResponse<T = unknown> {
  isSuccess: boolean;
  data?: T;
  error?: string;
  statusMessage?: string;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface LogContext {
  [key: string]: any;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  url?: string;
  userAgent?: string;
}

export interface CountryMetadata {
  ccIso2: string;
  nameEn: string;
  nameLocal: string;
  nameSk: string;
  ccIso3?: string;
  numericCode?: string;
  phoneCode?: string;
  continentId?: number;
  isEu?: boolean;
  isSchengen?: boolean;
  capitalEn?: string;
  currencyCode?: string;
  drivingSide?: 'left' | 'right';
  areaKm2?: number;
  createdAt?: IsoDateString;
  updatedAt?: IsoDateString;
}

export interface Language {
  lcIso2: string;
  ccIso2: string;
  nameEn: string;
  nativeName: string;
  isRtl: boolean;
}

export interface GroupedLanguage extends Language {
  group: GroupedLanguageType;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export type ColorMap<T extends string = string> = Record<T, HslColor>;

export type SemanticColor =
  | 'background'
  | 'surface'
  | 'input'
  | 'border'
  | 'muted'
  | 'emphasis'
  | 'hover'
  | 'active'
  | 'subtle'
  | 'overlay'
  | 'accent'
  | 'light';

export interface DotCategoryConfig {
  label: string;
  description: string;
  color: HslColor;
  icon: string;
}

export interface DotStatusConfig {
  label: string;
  description: string;

  color: HslColor;
  icon: string;
}

export interface ThemeRoleColorMap {
  [key: string]: HslColor;
}

export interface ThemeSettings {
  primaryColor: HslColor;
  secondaryColor?: HslColor;
  mode: ThemeMode;
  typography: {
    fontSizeBase: number;
  };
  layout: {
    borderRadius: number;
  };
  roleColors?: ThemeRoleColorMap;
  activeRole?: string;
}

export interface PendingVerificationInfo {
  email: string;
  expiresAt: number;
}

export interface VerificationResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
  alreadyVerified?: boolean;
}

export interface ResendResponse {
  success: boolean;
  expiresIn?: number;
  error?: string;
}

export interface VerifyCodeResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export interface UserWithMemberships {
  id: string;
  name: string;
  email: string;
  password?: string | null;
  isVerified: boolean;
  isActive: boolean;
  memberships: AuthMembership[];
}

export interface JWTPayload {
  id: string;
  role: AccessRole;
  organizationIds: string[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  accessRole: AccessRole;
  businessRole?: BusinessRole | null;
  memberships: AuthMembership[];
  activeOrgType?: ProjectOrgType;
}

export interface AuthMembership {
  organizationId: string;
  role: AccessRole;
  businessRole?: BusinessRole | null;
  status: MembershipStatus;
}

export interface ProjectOrgTypeDetails {
  key: ProjectOrgType;
  label: string;
  description: string;
  category: ProjectCategory;
}

export interface StageInfo {
  id: string;
  name: string;
  icon?: string | null;
  colorHsl?: HslColor | null;
  positionX?: number | null;
  positionY?: number | null;
  sequence: number;
  isActive: boolean;
  isRequired: boolean;
  organizationId: string;
  tasks: StageTaskInfo[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StageTaskInfo {
  id: string;
  title: string;
  description?: string | null;
  sequence: number;
  priority: TaskPriority;
  estimatedDuration?: number | null;
  status?: TaskProgressStatus;
  stageId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StageWithVehicleCount extends StageInfo {
  vehicleCount?: number;
}

export interface TaskInfo {
  id: string;
  title: string;
  description?: string;
  sequence: number;
  estimatedDuration?: number;
  priority?: TaskPriority;
}

export interface TaskProgress {
  id: string;
  task: Pick<TaskInfo, 'id' | 'title' | 'sequence'>;
  stage: Pick<StageInfo, 'id' | 'name' | 'sequence'>;
  status: TaskProgressStatus;
  notes?: string;
  startedAt?: Date;
  completedAt?: Date;
  vehicleId?: string;
  vehicle?: Pick<VehicleInfo, 'id' | 'brand' | 'model' | 'registrationNumber'>;
  workerId?: string;
  worker?: Pick<AuthUser, 'id' | 'name'>;
}

export interface VehiclePosition {
  x: number;
  y: number;
}

export interface VehicleCustomer {
  name: string;
  email?: string;
  phone?: string;
}

export interface VehicleInfo {
  id: string;
  brand: string;
  model: string;
  registrationNumber: string;
  vin?: string;
  customer: VehicleCustomer;
  currentStage?: StageInfo | null;
  currentStageId?: string | null;
  status: TaskProgressStatus;
  position?: VehiclePosition;
  qrCode?: string;
  trackingToken?: string;
  entryTime: Date;
  estimatedCompletion?: Date;
}

export type ThemeMode = 'light' | 'dark';

export type AccessRole = typeof ACCESS_ROLES[keyof typeof ACCESS_ROLES];
export type AuthMethod = typeof AUTH_METHODS[keyof typeof AUTH_METHODS];
export type AuthStatus = typeof AUTH_STATUSES[keyof typeof AUTH_STATUSES];
export type MembershipStatus = typeof MEMBERSHIP_STATUSES[keyof typeof MEMBERSHIP_STATUSES];
export type TaskProgressStatus = typeof TASK_PROGRESS_STATUSES[keyof typeof TASK_PROGRESS_STATUSES];
export type TaskPriority = typeof TASK_PRIORITIES[keyof typeof TASK_PRIORITIES];
export type ProjectCategory = typeof PROJECT_CATEGORIES[keyof typeof PROJECT_CATEGORIES];
export type ProjectOrgType = typeof PROJECT_ORG_TYPES[keyof typeof PROJECT_ORG_TYPES];
export type ProtectedResourceType = typeof PROTECTED_RESOURCE_TYPES[keyof typeof PROTECTED_RESOURCE_TYPES];
export type LogLevel = typeof LOG_LEVELS[keyof typeof LOG_LEVELS];
export type GroupedLanguageType = typeof GROUPED_LANGUAGE_TYPES[keyof typeof GROUPED_LANGUAGE_TYPES];
export type WebSocketEvent = typeof APP_CONFIG.websockets[keyof typeof APP_CONFIG.websockets];
export type StorageKey = typeof APP_CONFIG.technical.storageKeys[keyof typeof APP_CONFIG.technical.storageKeys];
export type PreloadPriorityLanguage = typeof I18N_CONFIG.preloadPriority[number];
export type BrandingColor = keyof typeof UI_CONFIG.branding.colors;
export type SystemColor = keyof typeof PROJECT_COLOR_CONFIG.systemColors;
export type PlatformCategory = typeof UI_CONFIG.platformCategoryMappings[keyof typeof UI_CONFIG.platformCategoryMappings];
export type BusinessRole = typeof PROJECT_CONFIG.businessRoles[number];
export type ZodiacSign = typeof ZODIAC_SIGNS[keyof typeof ZODIAC_SIGNS];