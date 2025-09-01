// File: common/types/project/org-type.types.ts
import type { ProjectDotCategory } from './dot-category.types';

export type ProjectOrgType =
  | 'bodyshop'
  | 'service'
  | 'dealer'
  | 'tuning'
  | 'wrapshop'
  | 'detailing';

// Extra details for mapping org → category
export interface ProjectOrganizationDetails {
  type: ProjectOrgType;
  primaryCategory: ProjectDotCategory;
}
