// File: common/types/auth.types.ts
// Last change: Consolidated all authentication and membership-related types into a single file

// ------------------------------
// Global access role
// ------------------------------
import type { AccessRole } from './access-role.types';
import type { ProjectOrgType } from './organization.types';

// ------------------------------
// Auth status
// ------------------------------
export const enum AuthStatus {
  ANONYMOUS = 'anonymous',
  COOKIES = 'cookies',
  REGISTERED = 'registered',
}

// ------------------------------
// Authentication method
// ------------------------------
export const enum AuthMethod {
  PASSWORD = 'password',
  GOOGLE = 'google',
  RFID = 'rfid',
  QR = 'qr',
  USB = 'usb',
}

// ------------------------------
// JWT payload
// ------------------------------
export interface JWTPayload {
  id: string;
  role: AccessRole;
  organization_ids: string[];
}

// ------------------------------
// Membership status
// ------------------------------
export const enum MembershipStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

// ------------------------------
// Organization membership info
// ------------------------------
export interface AuthMembership {
  organization_id: string;
  role: AccessRole;
  business_role?: string | null;
}

// ------------------------------
// Authenticated user context
// ------------------------------
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  is_verified: boolean;
  access_role: AccessRole;
  business_role?: string | null;
  memberships: AuthMembership[];
  active_org_type?: ProjectOrgType;
}