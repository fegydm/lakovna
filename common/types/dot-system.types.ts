// File: common/types/dot-system.types.ts
// Unified dot system types: categories and statuses (2-row model)

// =======================================
// Row 1: Categories
// =======================================

// Direct categories used in each project
export type DotCategory =
  | 'paint'        // Lakovňa: Category A
  | 'mechanical'   // Lakovňa: Category B
  | 'full-service' // Lakovňa: Category AB
  // Sendeliver: 'hauler' | 'sender' | 'broker' (future extension)

// Category config for UI rendering
export interface DotCategoryConfig {
  label: string;
  description: string;
  color: string;
  icon: string;
}

// =======================================
// Row 2: Statuses (auth states)
// =======================================
export type DotStatus = 'anonymous' | 'cookies' | 'registered';

// Status config for UI rendering
export interface DotStatusConfig {
  label: string;
  description: string;
  color: string;
  icon: string;
}
