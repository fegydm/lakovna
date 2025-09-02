// File: common/utils/dot-colors.utils.ts
// Last change: Unified support for Lakovňa DotCategory + legacy ProjectOrgType

import type { AuthStatus } from "common/types/auth.types";
import type { ProjectOrgType } from "common/types/org-type.types";
import type { DotCategory } from "common/types/dot-system.types";
import { DOT_CATEGORIES, DOT_STATUSES } from "common/configs/dot-system.config";

// ========== STATUS COLORS (auth states) ==========
export const DOTS_STATUS_COLORS: Record<AuthStatus | "inactive", string> = {
  inactive: "hsl(var(--color-gray-50))",
  ...Object.fromEntries(
    Object.entries(DOT_STATUSES).map(([status, cfg]) => [status, cfg.color])
  ) as Record<AuthStatus, string>,
};

// ========== CATEGORY COLORS (Lakovňa categories) ==========
export const DOTS_CATEGORY_COLORS: Record<DotCategory, string> = Object.fromEntries(
  Object.entries(DOT_CATEGORIES).map(([cat, cfg]) => [cat, cfg.color])
) as Record<DotCategory, string>;

// ========== ROLE COLORS (Sendeliver legacy orgTypes) ==========
export const DOTS_ROLE_COLORS: Record<ProjectOrgType, string> = {
  bodyshop: "hsl(var(--role-bodyshop-60))",
  service: "hsl(var(--role-service-60))",
  dealer: "hsl(var(--role-dealer-60))",
  tuning: "hsl(var(--role-tuning-60))",
  wrapshop: "hsl(var(--role-wrapshop-60))",
  detailing: "hsl(var(--role-detailing-60))",
};

// ===== Helpers =====
export const getStatusColor = (status: AuthStatus): string =>
  DOTS_STATUS_COLORS[status] || DOTS_STATUS_COLORS.inactive;

export const getCategoryColor = (category: DotCategory): string =>
  DOTS_CATEGORY_COLORS[category] || DOTS_STATUS_COLORS.inactive;

export const getRoleColor = (role: ProjectOrgType): string =>
  DOTS_ROLE_COLORS[role] || DOTS_STATUS_COLORS.inactive;
