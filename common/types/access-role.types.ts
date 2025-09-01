// File: common/types/access-role.types.ts
// AccessRole enum – single source of truth across platform and DB

export enum AccessRole {
  superadmin = 'superadmin',
  developer = 'developer',
  owner = 'owner',
  manager = 'manager',
  coordinator = 'coordinator',
  worker = 'worker',
  partner = 'partner',
  viewer = 'viewer'
}
