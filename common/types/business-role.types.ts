// File: common/types/business-role.types.ts
// Core + general business roles (shared across all org types)

// Core set of roles, stable across projects
export type CoreBusinessRole =
  | 'shop-owner'
  | 'advisor'
  | 'painter'
  | 'service-tech'
  | 'washer'; // Lakovňa-specific baseline

// General role: either core or custom-defined by organization owner
export type BusinessRole = CoreBusinessRole | string;

// Type guard for runtime checks
export const isCoreBusinessRole = (role: BusinessRole): role is CoreBusinessRole => {
  return ['shop-owner', 'advisor', 'painter', 'service-tech', 'washer'].includes(role);
};
