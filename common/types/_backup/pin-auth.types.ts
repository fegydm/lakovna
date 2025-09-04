// File: common/types/pin-auth.types.ts
// Last change: Moved types to the correct directory and updated for consistency

import { PROTECTED_RESOURCE_TYPES } from '../configs/pin-auth.config';

export type ProtectedResourceType = (typeof PROTECTED_RESOURCE_TYPES)[number];