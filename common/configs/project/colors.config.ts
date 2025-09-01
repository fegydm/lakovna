// File: common/configs/project/colors.config.ts

import type { ProjectOrgType } from '../../types/project/org-type.types';
import type { HslColor } from '../../types/shared/theme.types';

// Role colors
export const PROJECT_ROLE_COLORS: Record<ProjectOrgType, HslColor> = {
  bodyshop: { h: 120, s: 40, l: 55 },
  service: { h: 280, s: 60, l: 60 },
  dealer: { h: 210, s: 50, l: 60 },
  tuning: { h: 40, s: 80, l: 55 },
  wrapshop: { h: 30, s: 70, l: 60 },
  detailing: { h: 200, s: 50, l: 50 },
};

// Short names for CSS variable generation
export const CSS_ROLE_MAP: Record<ProjectOrgType, string> = {
  bodyshop: 'bsh',
  service: 'svc',
  dealer: 'dlr',
  tuning: 'tun',
  wrapshop: 'wrp',
  detailing: 'det',
};
