// File: common/types/project-category.types.ts
// Last change: Created project-specific categories for Lakovna, linked to platform categories

import { PROJECT_CATEGORIES } from '../configs/project-category.config.ts';

export type ProjectCategory = typeof PROJECT_CATEGORIES[keyof typeof PROJECT_CATEGORIES];