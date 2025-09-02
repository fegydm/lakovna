// File: common/configs/project-colors.config.ts
// Last change: Consolidated color configurations into a single object and applied snake_case

import type { ProjectOrgType } from '../types/organization.types';
import type { HslColor } from '../types/color.types';

export const PROJECT_COLOR_CONFIG = {
  // Project-specific role color mappings for Lakovna
  project_role_colors: {
    bodyshop: { h: 120, s: 40, l: 55 },
    service: { h: 280, s: 60, l: 60 },
    dealer: { h: 210, s: 50, l: 60 },
    tuning: { h: 40, s: 80, l: 55 },
    wrapshop: { h: 30, s: 70, l: 60 },
    detailing: { h: 200, s: 50, l: 50 },
  } as Record<ProjectOrgType, HslColor>,

  // Short names for CSS variable generation
  css_role_map: {
    bodyshop: 'bsh',
    service: 'svc',
    dealer: 'dlr',
    tuning: 'tun',
    wrapshop: 'wrp',
    detailing: 'det',
  } as Record<ProjectOrgType, string>,
};