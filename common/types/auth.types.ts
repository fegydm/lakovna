// File: common/types/auth.types.ts
// Unified auth-related type contracts (FE + BE)

// ------------------------------
// Global access role
// ------------------------------
import type { AccessRole } from './access-role.types';
import type { ProjectOrgType } from './org-type.types';

// ------------------------------
// Auth status (dot-system row 2)
// ------------------------------
export type AuthStatus =
  | 'anonymous'   // Guest, not logged in
  | 'cookies'     // Session-based login
  | 'registered'; // Fully authenticated

// ------------------------------
// JWT payload
// ------------------------------
export interface JWTPayload {
  id: string;
  role: string; // AccessRole (stored as string)
}

// ------------------------------
// Organization membership info
// ------------------------------
export interface AuthMembership {
  organizationId: string;
  role: AccessRole; // role within this organization
}

// ------------------------------
// Authenticated user context
// ------------------------------
export interface AuthUser {
  id: string; // globally unique user ID
  name: string;
  email: string;
  role: AccessRole; // global access role (owner, manager, etc.)
  isActive: boolean;

  // Optional metadata
  imageUrl?: string;
  emailVerified?: boolean;
  isAdmin?: boolean;

  // Current active context
  activeOrgType?: ProjectOrgType;

  // Linked organizations (with roles) - made optional for now
  memberships?: AuthMembership[];
}
