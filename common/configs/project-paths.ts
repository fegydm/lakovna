// File: common/configs/project/project-paths.ts
// Defines route paths for each DotCategory in the Lakovňa project

import type { DotCategory } from '../types/dot-system.types';

export const PROJECT_CATEGORY_PATHS: Record<DotCategory, string> = {
  paint: '/paint',
  mechanical: '/mechanical',
  'full-service': '/full-service',
};
