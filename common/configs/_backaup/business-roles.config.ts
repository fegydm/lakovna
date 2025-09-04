// File: common/configs/business-roles.config.ts
// Last change: Moved runtime array to a config file for clean separation of types and code.

export const BUSINESS_ROLES_BASE = [
  'shop_owner',
  'advisor',
  'painter',
  'service_tech',
  'washer',
] as const;