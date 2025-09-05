// File: common/types/auth.types.ts
// Last change: Finalized and unified all auth-related types.
// Contains all types related to authentication, authorization, users, and memberships.

import {
  ACCESS_ROLES,
  AUTH_METHODS,
  AUTH_STATUSES,
  MEMBERSHIP_STATUSES,
} from '../configs/01-constants.config';
import { PROJECT_CONFIG } from '../configs/project.config';
import type { ProjectCategory, ProjectOrgType } from './shared.types';
import type { UserDTO } from './user.types';
import type { OrganizationDTO, MembershipDTO } from './organization.types';

export interface Invite {
  id: string;
  organizationId: string;
  email: string;
  accessRole: AccessRole;
  token: string;
  expiresAt: Date;
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

/**
 * Represents the clean, application-level user model after business logic has been applied.
 * This is the primary user object used within the application state.
 */
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

/**
 * Represents the application-level membership model.
 */
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

export interface SessionData {
  user: AuthUser;
}

/**
 * Represents the standardized successful response from authentication services.
 */
export interface AuthResponse {
  token: string;
  user: AuthUser;
  organization?: OrganizationDTO;
  membership: MembershipDTO;
}

export type AccessRole = typeof ACCESS_ROLES[keyof typeof ACCESS_ROLES];
export type AuthMethod = typeof AUTH_METHODS[keyof typeof AUTH_METHODS];
export type AuthStatus = typeof AUTH_STATUSES[keyof typeof AUTH_STATUSES];
export type MembershipStatus = typeof MEMBERSHIP_STATUSES[keyof typeof MEMBERSHIP_STATUSES];
export type BusinessRole = typeof PROJECT_CONFIG.businessRoles[number];