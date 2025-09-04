// File: common/types/business-role.types.ts
// Last change: Updated type to be defined solely by the config file.

import { BUSINESS_ROLES_BASE } from '../configs/business-roles.config';

export type BusinessRole = (typeof BUSINESS_ROLES_BASE)[number] | string;