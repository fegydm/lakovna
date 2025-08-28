// File: common/types/app-role.types.ts
// Last change: Unified app roles for frontend and backend via common module

export type AppRole = 'service' | 'bodyshop' | 'dealer';

export const APP_ROLES: AppRole[] = ['service', 'bodyshop', 'dealer'];

export const APP_ROLE_PATHS: Record<AppRole, string> = {
  service: '/service',
  bodyshop: '/bodyshop',
  dealer: '/dealer',
};

export const APP_ROLE_MAP: Record<AppRole, string> = {
  service: 'service',
  bodyshop: 'bodyshop',
  dealer: 'dealer',
};

export const CSS_ROLE_MAP: Record<AppRole, string> = {
  service: 'srv',
  bodyshop: 'bsh',
  dealer: 'dlr',
};
