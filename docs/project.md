# Automotive Workshop Management System v5.1.3 (Final)

## 📋 Project Overview

This document describes the architecture of a universal SaaS template system, with **Lakovňa** as the first instance.
The system is built on the PERN stack with modular architecture designed for easy replication and deployment of new projects.

### 🔑 Key Principle: Agnostic Template

- **Specific project name** (e.g., `lakovna`) exists **only in the root directory name**
- **All internal files**, types, and variables use **generic names** (`project.config.ts`, `ProjectOrgType`)
- **New projects** are created simply by **copying the template directory**

### 🌐 SaaS Platform Context

The platform supports multiple projects from one template base:
- **Lakovňa** – Automotive workshop platform
- **Sendeliver** – Logistics ecosystem (hauler ↔ sender ↔ broker)
- **Future Projects** – ready for expansion

---

## 🏗️ Architecture Overview

### Tech Stack (PERN)
```
Frontend:  React 18 + TypeScript + CSS Modules
Backend:   Node.js + Express + TypeScript
Database:  PostgreSQL + Prisma ORM
Real-time: WebSocket (Socket.io)
Platform:  Universal template system
```

### Project Structure (v5.1.3 Final)
```
project-name/             # 📂 Instance name (e.g., "lakovna")
├── database/               # 🗄️ Database
│   ├── schema.prisma
│   ├── migrations/
│   ├── client.ts
│   └── seeds/
│
├── environments/           # 🌍 Environment configurations
│   ├── .env.development
│   ├── .env.staging
│   ├── .env.production
│   └── .env.example
│
├── common/                 # 🔄 Shared resources (SINGLE SOURCE OF TRUTH)
│   ├── types/              # 🔵 Pure TypeScript types (NO RUNTIME VALUES)
│   │   ├── back/           #    Backend-only types
│   │   │   ├── express.d.ts
│   │   │   └── socket.types.ts
│   │   ├── front/          #    Frontend-only types
│   │   │   └── ui-state.types.ts
│   │   └── [shared]/       #    Cross-platform types (default location)
│   │       ├── auth.types.ts           # Unified auth types
│   │       ├── access-role.types.ts
│   │       ├── dot-category.types.ts
│   │       ├── organization.types.ts
│   │       ├── user.types.ts
│   │       ├── geo.types.ts
│   │       ├── vehicle.types.ts
│   │       └── stage.types.ts
│   │
│   ├── configs/            # 🟡 Runtime configurations (USES TYPES)
│   │   ├── identity.meta.ts        #    Project meta info (name, version)
│   │   ├── project.config.ts       #    Main runtime config
│   │   ├── access-role.config.ts   #    Role hierarchy & permissions
│   │   ├── auth.config.ts          #    Auth status labels & colors
│   │   ├── dot-category.config.ts  #    Dot mappings & colors
│   │   └── theme.config.ts         #    Branding & colors
│   │
│   ├── constants/          # 🔢 Application constants
│   │   ├── api.constants.ts
│   │   └── validation.constants.ts
│   │
│   ├── validators/         # ✅ Zod validation schemas
│   │   ├── auth.validators.ts
│   │   └── vehicle.validators.ts
│   │
│   └── utils/              # 🛠️ Utilities (ORGANIZED BY TARGET)
│       ├── back/           #    Backend-only helpers
│       │   ├── cookies.utils.ts
│       │   └── validation.utils.ts
│       ├── front/          #    Frontend-only helpers
│       │   ├── localStorage.utils.ts
│       │   ├── translations.utils.ts
│       │   └── ui.utils.ts
│       └── [shared]/       #    Neutral utilities (default)
│           ├── string.utils.ts
│           ├── array.utils.ts
│           ├── date.utils.ts
│           ├── logger.utils.ts
│           └── colors.utils.ts
│
├── back/                   # 🚀 Backend (MAX 9 ROOT DIRECTORIES)
│   ├── src/
│   │   ├── core/           # Core setup & infrastructure
│   │   │   ├── prisma.client.ts     # Prisma client instance
│   │   │   ├── passport.setup.ts    # Passport strategies
│   │   │   ├── websocket.manager.ts # Socket.io manager
│   │   │   └── app.config.ts        # App-level configs
│   │   │
│   │   ├── auth/           # Authentication system
│   │   │   ├── jwt.security.ts      # JWT utilities (SECURITY SENSITIVE)
│   │   │   ├── crypto.security.ts   # Password hashing (SECURITY SENSITIVE)
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.guards.ts
│   │   │
│   │   ├── controllers/    # REST controllers
│   │   │   ├── vehicle.controller.ts
│   │   │   ├── stage.controller.ts
│   │   │   ├── organization.controller.ts
│   │   │   └── public.controller.ts
│   │   │
│   │   ├── middlewares/    # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   ├── rate-limit.middleware.ts
│   │   │   └── error-handler.middleware.ts
│   │   │
│   │   ├── routes/         # Route definitions
│   │   │   ├── auth.routes.ts
│   │   │   ├── vehicle.routes.ts
│   │   │   ├── organization.routes.ts
│   │   │   └── public.routes.ts
│   │   │
│   │   ├── services/       # Business logic & application services
│   │   │   ├── vehicle.service.ts
│   │   │   ├── stage.service.ts
│   │   │   ├── organization.service.ts
│   │   │   ├── notification.service.ts
│   │   │   └── tracking.service.ts
│   │   │
│   │   └── server.ts       # Main server entry point
│   │
│   └── protected/          # 🔒 PIN-protected documentation
│       ├── api-docs/
│       ├── architecture/
│       └── deployment/
│
├── front/                  # ⚛️ Frontend
│   ├── src/
│   │   ├── apps/           # Domain applications
│   │   │   ├── home/       # Landing page app
│   │   │   ├── portal/     # Main workshop app
│   │   │   ├── tracking/   # Customer QR tracking
│   │   │   └── admin/      # System admin
│   │   │
│   │   ├── services/       # API communication
│   │   │   ├── api.base.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── vehicle.service.ts
│   │   │   └── websocket.service.ts
│   │   │
│   │   ├── shared/         # UI components
│   │   │   ├── base/       # Basic components (button, input)
│   │   │   ├── elements/   # Business components (vehicle-card)
│   │   │   ├── layouts/    # Layout components
│   │   │   └── icons/      # Icon components
│   │   │
│   │   ├── contexts/       # React Context providers
│   │   │   ├── auth.context.tsx
│   │   │   ├── organization.context.tsx
│   │   │   └── websocket.context.tsx
│   │   │
│   │   ├── hooks/          # Custom React hooks
│   │   │   ├── use-auth.ts
│   │   │   ├── use-api.ts
│   │   │   └── use-websocket.ts
│   │   │
│   │   └── main.tsx        # App entry point
│   │
│   └── public/
│
├── templates/              # 📋 Project templates
│   ├── project.template.config.ts
│   ├── prisma.template.schema
│   └── README.template.md
│
├── scripts/                # 🛠️ Build & deployment scripts
├── docs/                   # 📚 Documentation
└── package.json
```

---

## 🎯 Key Architecture Changes (v5.1.x)

### 1. Type/Config Separation (v5.1.2)
```typescript
// ✅ CORRECT - types only (NO runtime values)
// File: common/types/auth.types.ts
export enum AuthStatus {
  ANONYMOUS = 'anonymous',
  COOKIES = 'cookies',
  REGISTERED = 'registered'
}

export interface AuthUser {
  id: string;
  email: string;
  accessRole: AccessRole;
  businessRole?: string;
  memberships: AuthMembership[];
}

export interface JWTPayload {
  userId: string;
  organizationId?: string;
  accessRole: AccessRole;
}

// ✅ CORRECT - runtime config (USES types)
// File: common/configs/auth.config.ts
import type { AuthStatus } from 'common/types/auth.types';

export const AUTH_STATUS_LABELS: Record<AuthStatus, string> = {
  [AuthStatus.ANONYMOUS]: 'Anonymous',
  [AuthStatus.COOKIES]: 'Temporary',
  [AuthStatus.REGISTERED]: 'Registered'
};
```

### 2. Unified Role System (v5.1.0)
- **Single `AccessRole`** as source of truth across DB, backend, and frontend
- **Removed redundant `WorkerRole`** mapping
- **`businessRole`** is now project-specific string/union

```typescript
// File: common/types/access-role.types.ts
export enum AccessRole {
  SUPERADMIN = 'superadmin',
  DEVELOPER = 'developer', 
  OWNER = 'owner',
  MANAGER = 'manager',
  COORDINATOR = 'coordinator',
  WORKER = 'worker',
  PARTNER = 'partner',
  VIEWER = 'viewer'
}

// File: common/configs/access-role.config.ts
export const ACCESS_ROLE_HIERARCHY: Record<AccessRole, number> = {
  [AccessRole.SUPERADMIN]: 100,
  [AccessRole.DEVELOPER]: 90,
  [AccessRole.OWNER]: 80,
  [AccessRole.MANAGER]: 60,
  [AccessRole.COORDINATOR]: 50,
  [AccessRole.WORKER]: 40,
  [AccessRole.PARTNER]: 30,
  [AccessRole.VIEWER]: 10
};
```

### 3. Simplified Dot Categories (v5.1.0)
```typescript
// File: common/types/dot-category.types.ts
export type DotCategory = 'A' | 'B' | 'AB';

// File: common/configs/dot-category.config.ts
export const DOT_CATEGORY_MAP: Record<DotCategory, {
  label: string;
  icon: string;
  color: string;
}> = {
  'A':  { label: 'Karoséria & Vizuál', icon: '🎨', color: 'hsl(var(--primary))' },
  'B':  { label: 'Mechanika & Servis', icon: '🔧', color: 'hsl(var(--secondary))' },
  'AB': { label: 'Komplexné služby', icon: '🏪', color: 'hsl(var(--accent))' }
};
```

### 4. Backend Structure (v5.0.4)
- **Max 9 directories** at `back/src/` root level
- **Security-sensitive code** in `back/src/auth/` (JWT, crypto)
- **Clean separation** of concerns

### 5. Utils Organization (v5.1.3)
- `common/utils/` (root) → **neutral utilities** (string, date, array)
- `common/utils/back/` → **backend-only helpers** (cookies, validation) 
- `common/utils/front/` → **frontend-only helpers** (localStorage, UI)
- `back/src/auth/` → **security-sensitive utilities** (JWT, hashing)

---

## 🎨 Universal 3+3 Dots System

### Categories (Row 1)
```typescript
type DotCategory = 'A' | 'B' | 'AB';

// Project-specific mapping (Lakovňa):
A  → 🎨 Karoséria & Vizuál
B  → 🔧 Mechanika & Servis  
AB → 🏪 Komplexné služby
```

### Auth Status (Row 2)
```typescript
type AuthStatus = 'anonymous' | 'cookies' | 'registered';

// Universal workflow states:
anonymous  → 🔓 Anonymous user
cookies    → ⚡ Temporary session
registered → ✅ Registered user
```

---

## 🏢 Organization Types (Project-Specific)

### Type Mapping to Dot Categories
```typescript
// File: common/configs/project.config.ts
export const PROJECT_ORG_TYPE_MAPPING: Record<ProjectOrgType, {
  primaryCategory: DotCategory;
  canAlsoAccess: DotCategory[];
  label: string;
  icon: string;
  defaultStages: string[];
}> = {
  'bodyshop': {
    primaryCategory: 'A',
    canAlsoAccess: ['B'],
    label: 'Karosárska dielňa',
    icon: '🎨',
    defaultStages: ['príjem', 'umývanie', 'príprava', 'lakovanie', 'dokončenie']
  },
  'service': {
    primaryCategory: 'B', 
    canAlsoAccess: ['A'],
    label: 'Autoservis',
    icon: '🔧',
    defaultStages: ['príjem', 'diagnostika', 'oprava', 'testovanie', 'odovzdanie']
  },
  'dealer': {
    primaryCategory: 'AB',
    canAlsoAccess: [],
    label: 'Autorizovaný dealer', 
    icon: '🏪',
    defaultStages: ['príjem', 'hodnotenie', 'príprava', 'prezentácia', 'predaj']
  },
  'tuning': {
    primaryCategory: 'B',
    canAlsoAccess: ['A'],
    label: 'Tuning centrum',
    icon: '⚡',
    defaultStages: ['konzultácia', 'meranie', 'montáž', 'ladenie', 'testovanie']
  }
};
```

---

## 🔐 Authentication System

### Unified Auth Types
```typescript
// File: common/types/auth.types.ts
export enum AuthStatus {
  ANONYMOUS = 'anonymous',
  COOKIES = 'cookies', 
  REGISTERED = 'registered'
}

export interface JWTPayload {
  userId: string;
  organizationId?: string;
  accessRole: AccessRole;
  exp?: number;
  iat?: number;
}

export interface AuthMembership {
  organizationId: string;
  accessRole: AccessRole;
  businessRole?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  isVerified: boolean;
  accessRole: AccessRole;
  businessRole?: string;
  memberships: AuthMembership[];
}
```

### Business Positions (Project-Specific)
```typescript
// File: common/types/vehicle.types.ts (or project-specific)
export type ProjectBusinessPosition =
  | 'shop-owner'
  | 'painter'
  | 'service-tech'
  | 'advisor'
  | 'estimator'
  | 'detailer'
  | 'wrapper';
```

### Verified Organizations
- **Database**: `Organization { isVerified Boolean @default(false) }`
- **Type**: `interface Organization { isVerified: boolean }`
- **Endpoint**: `PUT /api/organizations/:id/verify` (superadmin only)

---

## ⚙️ Configurable Stages System

Each project defines workflows (stages) that map to dot categories:

```typescript
interface Stage {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: DotCategory;  // Links to dots
  sequence: number;
  tasks: StageTask[];     // Max 8 tasks per stage
}
```

### Industry Templates
- **Paint Shop**: Príjem → Umývanie → Príprava → Lakovanie → Dokončenie
- **Service**: Príjem → Diagnostika → Oprava → Testovanie → Odovzdanie
- **Dealer**: Príjem → Hodnotenie → Príprava → Prezentácia → Predaj

---

## 📱 Customer Experience (Optional)

### QR Code Tracking
- QR code generated on vehicle entry
- Tracking via `lakovna.com/track/{token}`
- Real-time progress based on stages

```typescript
interface CustomerTrackingView {
  vehicle: VehicleInfo;
  currentStage: StageProgress;
  timeline: StageProgress[];
  estimatedCompletion: Date;
  photos?: string[];
}
```

---

## 🧪 Development Guidelines & Conventions

### File Naming
- **Types**: `[domain].types.ts`
- **Configs**: `[domain].config.ts`
- **Meta**: `[domain].meta.ts` (project info, not runtime)
- **Utils**: `[domain].utils.ts`
- **Components**: `[name].[domain].tsx`
- **Services**: `[domain].service.ts`

### Import Patterns
```typescript
// Shared types (default location)
import type { AuthUser, JWTPayload } from 'common/types/auth.types';

// Backend-only types
import type { ExpressRequest } from 'common/types/back/express.d.ts';

// Frontend-only types  
import type { UIState } from 'common/types/front/ui-state.types';

// Runtime configs
import { PROJECT_ORG_TYPE_MAPPING } from 'common/configs/project.config';
import { ACCESS_ROLE_HIERARCHY } from 'common/configs/access-role.config';

// Utilities (neutral)
import { formatDate } from 'common/utils/date.utils';

// Frontend-only utils
import { getLocalStorage } from 'common/utils/front/localStorage.utils';

// Backend-only utils
import { setCookie } from 'common/utils/back/cookies.utils';

// Security-sensitive (backend only)
import { generateJWT } from './auth/jwt.security';
```

### Directory Rules
- `common/` = **single source of truth** (types, configs, utils, constants)
- `common/types/` = **pure types only** (no runtime values)
- `common/configs/` = **runtime configurations** (uses types)
- `back/src/auth/` = **security-sensitive utilities**
- **No duplications** between FE/BE

### CSS (No Tailwind)
```css
/* Use CSS Modules */
.project-toolbar {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: hsl(var(--surface));
}
```

---

## 🚦 Setup for New Project

### 1. Clone Template
```bash
cp -r automotive-template project-name
cd project-name
```

### 2. Configure Project Identity
```typescript
// Edit common/configs/identity.meta.ts
export const PROJECT_IDENTITY = {
  name: 'Your Project',
  version: '1.0.0',
  domain: 'yourproject.com',
  description: 'Project description'
};
```

### 3. Configure Runtime Settings
```typescript
// Edit common/configs/project.config.ts
export const PROJECT_CONFIG = {
  orgTypes: { /* ... */ },
  dotMappings: { /* ... */ },
  routing: { /* ... */ }
};
```

### 4. Setup Environment
```bash
cp environments/.env.example environments/.env.development
# Edit environment variables
```

### 5. Database Setup
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 6. Start Development
```bash
npm run dev
```

---

## 📊 Optional Features

### Core Features (Always Included)
- Vehicle/Entity tracking
- Stage workflow
- Multi-tenant support
- Role-based access

### Optional Features (Configurable)
- QR code tracking
- Photo documentation
- Inventory management
- Scheduling system
- Invoicing
- Analytics dashboard
- API access
- RFID/USB authentication

---

## 🔄 Migration Summary (v5.0 → v5.1.3)

### Key Changes
1. **Type/Config Separation** (v5.1.2) - Clean separation of pure types from runtime
2. **Unified Auth Types** (v5.1.2) - All auth types in single file
3. **Simplified Roles** (v5.1.0) - Single `AccessRole` enum across system
4. **Dot Categories** (v5.1.0) - Unified `DotCategory` type 
5. **Backend Structure** (v5.0.4) - Max 9 directories, clean organization
6. **Utils Organization** (v5.1.3) - Security isolation, clear target separation
7. **Identity Meta** (v5.1.1) - Renamed for clarity

### Benefits
- **Clean Separation** - Types vs runtime clearly separated
- **Security Isolation** - Sensitive code cannot leak to frontend
- **Consistent Imports** - Predictable patterns across codebase
- **Easy Replication** - One template for all projects
- **Future Proof** - Ready for additional projects

---

*✅ This is the complete v5.1.3 Final documentation, incorporating all changelog updates and architectural improvements.*