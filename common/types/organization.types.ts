// File: common/types/organization.types.ts
// Last change: Renamed file and types for consistency

export type ProjectOrgType =
  | 'bodyshop'
  | 'service'
  | 'dealer'
  | 'tuning'
  | 'wrapshop'
  | 'detailing';

export interface ProjectOrgTypeDetails {
  key: ProjectOrgType;
  label: string;
  description: string;
}