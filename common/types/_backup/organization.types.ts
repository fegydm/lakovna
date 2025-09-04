// File: common/types/organization.types.ts
// Last change: Renamed file and types for consistency

import { PROJECT_ORG_TYPES } from '../configs/organization-types.config';

export type ProjectOrgType = (typeof PROJECT_ORG_TYPES)[number];

export interface ProjectOrgTypeDetails {
  key: ProjectOrgType;
  label: string;
  description: string;
}