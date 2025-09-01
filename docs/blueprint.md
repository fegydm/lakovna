Blueprint v5 (Final Alignment with Documentation)
🎯 Cieľ

Striktne oddeliť typy (štruktúry, compile-time definície) od konfigurácie (runtime hodnoty). Projekt je generický — názov projektu sa objaví iba v názve root priečinka, nikdy vo vnútri súborov.

📜 Kľúčové princípy

common/types/ = iba typy (type, interface, enum) – nikdy hodnoty.

common/configs/ = iba runtime dáta (const objekty, mapovania, farby, texty).

Jednosmerný import: configs → types. Nikdy naopak.

3+3 dots systém:

Row 1 (top) = UniversalProjectDotCategory = 'A' | 'B' | 'AB'

Row 2 (bottom) = UniversalAuthStatus = 'anonymous' | 'cookies' | 'registered'

Projektové mapovania rieši project.config.ts.

📁 Finálna štruktúra
common/
├── types/                  
│   ├── universal/           # Typy platné pre celú SaaS platformu
│   │   ├── auth.types.ts    # AuthStatus, AccessRole
│   │   └── platform.types.ts # UniversalProjectDotCategory
│   │
│   ├── shared/              # Cross-project business typy
│   │   ├── organization.types.ts
│   │   ├── vehicle.types.ts
│   │   ├── stage.types.ts
│   │   └── worker.types.ts
│   │
│   └── project/             # Projekt-špecifické typy (generické názvy)
│       └── project.types.ts
│
└── configs/                
    ├── universal/           # Konfigurácie pre všetky projekty
    │   ├── auth.config.ts
    │   └── dots.config.ts
    │
    ├── project/             # Projekt-špecifické konfigurácie
    │   └── project.config.ts
    │
    └── runtime/             # Čisto runtime technické nastavenia
        ├── api.config.ts
        └── colors.config.ts

✅ Príklad implementácie
1. Typy (iba štruktúra)
// File: common/types/universal/auth.types.ts
export enum AuthStatus {
  anonymous = 'anonymous',
  cookies = 'cookies',
  registered = 'registered'
}

export type AccessRole =
  | 'superadmin'
  | 'developer'
  | 'owner'
  | 'manager'
  | 'worker'
  | 'partner'
  | 'viewer';

// File: common/types/universal/platform.types.ts
export type UniversalProjectDotCategory = 'A' | 'B' | 'AB';

2. Konfigurácia (iba hodnoty)
// File: common/configs/universal/auth.config.ts
import { AuthStatus, AccessRole } from '../../types/universal/auth.types';

export const AUTH_STATUS_LABELS: Record<AuthStatus, string> = {
  anonymous: 'Anonymný',
  cookies: 'Dočasný prístup',
  registered: 'Registrovaný'
};

export const ACCESS_ROLE_PERMISSIONS: Record<AccessRole, string[]> = {
  superadmin: ['*'],
  developer: ['manage_dev'],
  owner: ['manage_organization', 'view_billing'],
  manager: ['manage_vehicles', 'manage_workers'],
  worker: ['manage_own_tasks'],
  partner: ['external_access'],
  viewer: []
};

// File: common/configs/universal/dots.config.ts
import { UniversalProjectDotCategory } from '../../types/universal/platform.types';

export const UNIVERSAL_CATEGORY_LABELS: Record<UniversalProjectDotCategory, string> = {
  A: 'Category A',
  B: 'Category B',
  AB: 'Category AB'
};

3. Projektové typy
// File: common/types/project/project.types.ts
import { UniversalProjectDotCategory } from '../universal/platform.types';

export type ProjectOrgType =
  | 'bodyshop'
  | 'service'
  | 'dealer'
  | 'tuning'
  | 'autofolie';

export type ProjectBusinessPosition =
  | 'shop-owner'
  | 'painter'
  | 'service-tech'
  | 'advisor';

export interface ProjectOrganizationDetails {
  type: ProjectOrgType;
  primaryCategory: UniversalProjectDotCategory;
}

4. Projektová konfigurácia
// File: common/configs/project/project.config.ts
import { ProjectOrgType } from '../../types/project/project.types';
import { UniversalProjectDotCategory } from '../../types/universal/platform.types';

export const PROJECT_ORG_TYPE_MAPPING: Record<ProjectOrgType, {
  primaryCategory: UniversalProjectDotCategory;
  label: string;
}> = {
  bodyshop: { primaryCategory: 'A', label: 'Karosárska dielňa' },
  service: { primaryCategory: 'B', label: 'Autoservis' },
  dealer: { primaryCategory: 'AB', label: 'Autorizovaný dealer' },
  tuning: { primaryCategory: 'B', label: 'Tuning centrum' },
  autofolie: { primaryCategory: 'A', label: 'Autofólie & wrapping' }
};

🚀 Checklist migrácie

Vytvoriť štruktúru common/types a common/configs.

Presunúť všetky type, interface, enum → do types.

Presunúť všetky konštanty a objekty → do configs.

Refaktorovať importy: FE aj BE vždy importujú z common/.

Validovať: žiadny typ nesmie importovať hodnoty z configs.