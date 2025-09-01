## [v5.0.1] - 2025-08-30
### Changed
- Renamed root `project.config.ts` → `identity.config.ts` for clarity.
  - `identity.config.ts` now contains only project identity metadata (name, version, domain).
  - All business mappings (orgTypes, projectDots, branding, routing) remain in `common/configs/project/project.config.ts`.

### Rationale
- Aligns with v5 documentation principle of strict **Type/Config separation**.
- Improves readability: `identity.config.ts` = identity/meta, `project.config.ts` = project-specific runtime config.


## [v5.0.2] - 2025-08-30
### Changed
- Split project identity and runtime config:
  - `identity.config.ts` (root) = project identity (name, version, domain).
  - `common/configs/project/project.config.ts` = runtime config (orgTypes, dots, routing, branding).

Changelog – 2025-08-30

[Changed] Naming convention for DotCategory types

Adopted consistent naming convention across universal and project scopes.

UniversalDotCategory → always used for A/B/AB categories.

ProjectDotCategory → always used for project-specific categories (e.g., paint/mechanical/full-service).

Updated import style:

import type { UniversalDotCategory } from '@/common/types/universal/dot-category.types';
import type { ProjectDotCategory } from '@/common/types/project/dot-category.types';

Changelog – 2025-08-30

[Changed] Naming consistency for dot-related and role types

All universal types renamed with Universal prefix.

All project-specific types renamed with Project prefix.

Filenames now match exported symbols exactly (dot-category.types.ts, auth-status.types.ts, access-role.types.ts, org-type.types.ts, business-role.types.ts).

Prevents confusion between universal vs project scope.
