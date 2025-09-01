// File: common/types/org-type.types.ts
import type { DotCategory } from './dot-system.types';

// All possible organization types in Lakovňa project
export interface ProjectOrgTypeDetails {
  key: 'bodyshop' | 'service' | 'dealer' | 'tuning' | 'wrapshop' | 'detailing';
  label: string;
  description: string;
  category: DotCategory; // ✅ unified (paint | mechanical | full-service)
}

// Extract union type for usage where only the key matters
export type ProjectOrgType = ProjectOrgTypeDetails['key'];
