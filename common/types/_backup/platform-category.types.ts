// File: common/types/platform-category.types.ts
// Last change: Created universal platform categories for all projects

import { PLATFORM_CATEGORIES } from '../configs/platform-category.config';

export type PlatformCategory = (typeof PLATFORM_CATEGORIES)[number];