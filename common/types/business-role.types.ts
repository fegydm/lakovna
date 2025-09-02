// File: common/types/business-role.types.ts
// Last change: Updated to align with naming conventions and use 'as const'

export const BUSINESS_ROLES_BASE = [
  'shop_owner',
  'advisor',
  'painter',
  'service_tech',
  'washer',
] as const;

export type BusinessRole = (typeof BUSINESS_ROLES_BASE)[number] | string;