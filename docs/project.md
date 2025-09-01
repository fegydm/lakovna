Automotive Workshop Management System v5 (Final Template Version)
📋 Project Overview

Tento dokument popisuje architektúru univerzálneho SaaS template systému, ktorého prvou inštanciou je projekt Lakovňa.
Systém je postavený na PERN stacku s modulárnou architektúrou navrhnutou pre jednoduchú replikáciu a nasadenie nových projektov.

🔑 Kľúčový princíp: Agnostický Template

Názov konkrétneho projektu (napr. lakovna) existuje iba v názve koreňového adresára.

Všetky vnútorné súbory, typy a premenné používajú generické názvy (project.config.ts, ProjectOrgType).

Nový projekt sa vytvorí jednoducho skopírovaním template adresára.

🌐 SaaS Platform Context

Platforma podporuje viacero projektov z jedného template základu:

Lakovňa – Automotive workshop platform

Sendeliver – Logistics ecosystem (hauler ↔ sender ↔ broker)

Future Projects – pripravené na expanziu

🏗️ Architecture Overview
Tech Stack (PERN)
Frontend:  React 18 + TypeScript + CSS Modules
Backend:   Node.js + Express + TypeScript
Database:  PostgreSQL + Prisma ORM
Real-time: WebSocket (Socket.io)
Platform:  Universal template system

Project Structure (v5 Final Template)
project-name/             # 📂 Názov inštancie (napr. "lakovna")
├── database/               # 🗄️ Databáza
│   ├── schema.prisma
│   └── seeds/
│
├── environments/           # 🌍 Environment konfigurácie
│   ├── .env.development
│   └── .env.example
│
├── common/                 # 🔄 Zdieľané zdroje (JEDINÝ ZDROJ PRAVDY)
│   ├── types/              # 🔵 Typy
│   │   ├── universal/      #    Platform-wide (auth, roles, dots)
│   │   ├── shared/         #    Biznis typy (organization, user, geo)
│   │   └── project/        #    Projekt-špecifické (generické názvy)
│   │
│   ├── configs/            # 🟡 Konfigurácie
│   │   ├── universal/      #    Platform-wide configs
│   │   └── project/        #    Projekt-špecifické configs
│   │
│   ├── constants/          # 🔢 Konštanty
│   ├── validators/         # ✅ Validátory (Zod schemas)
│   └── utils/              # 🛠️ Utility (logger, colors, language)
│
├── back/                   # 🚀 Backend
│   ├── src/
│   │   ├── setup/          # Init služby
│   │   ├── security/       # Bezpečnostné utily (crypto, jwt)
│   │   └── server.ts
│   └── protected/          # 🔒 PIN-protected dokumentácia
│
├── front/                  # ⚛️ Frontend
│   └── src/
│
├── templates/              # 📋 Templaty pre generovanie
└── package.json

🎨 Universal 3+3 Dots System
Universal Types

Definované v common/types/universal/dot-category.types.ts.

// Univerzálne kategórie (Row 1)
export type UniversalDotCategory = 'A' | 'B' | 'AB';

// Univerzálny status autentifikácie
export type UniversalAuthStatus = 'anonymous' | 'cookies' | 'registered';

Project-Specific Mapping (Lakovňa)

Definované v common/configs/project/project.config.ts.

export const PROJECT_CATEGORY_MAPPING: Record<UniversalDotCategory, { label: string; icon: string }> = {
  A:  { label: 'Karoséria & Vizuál',   icon: '🎨' },
  B:  { label: 'Mechanika & Servis',   icon: '🔧' },
  AB: { label: 'Komplexné služby',     icon: '🏪' },
};

🏢 Organization Types (Project-Specific)
Typy

Definované v common/types/project/org-type.types.ts.

export type ProjectOrgType = 'bodyshop' | 'service' | 'dealer' | 'tuning';

Mapovanie

Definované v common/configs/project/project.config.ts.

export const PROJECT_ORG_TYPE_MAPPING: Record<ProjectOrgType, {
  primaryCategory: UniversalDotCategory;
  label: string;
}> = {
  bodyshop: { primaryCategory: 'A', label: 'Karosárska dielňa' },
  service:  { primaryCategory: 'B', label: 'Autoservis' },
  dealer:   { primaryCategory: 'AB', label: 'Autorizovaný dealer' },
  tuning:   { primaryCategory: 'B', label: 'Tuning centrum' },
};

🔐 Authentication System
Access Roles (Universal)

Definované v common/types/universal/access-role.types.ts.

export enum AccessRole {
  superadmin = 'superadmin',
  developer = 'developer',
  owner = 'owner',
  manager = 'manager',
  coordinator = 'coordinator',
  worker = 'worker',
  partner = 'partner',
  viewer = 'viewer'
}

Business Positions (Project)

Definované v common/types/project/business-role.types.ts.

export type ProjectBusinessPosition =
  | 'shop-owner'
  | 'painter'
  | 'service-tech'
  | 'advisor'
  | 'detailer'
  | 'wrapper';

Verified Organizations

DB (schema.prisma): Organization { isVerified Boolean @default(false) }

Typ (common/types/shared/organization.types.ts):
interface Organization { isVerified: boolean }

Endpoint: PUT /api/organizations/:id/verify (iba superadmin)

⚙️ Configurable Stages System

Každý projekt si definuje workflow (stages), ktoré sa mapujú na dot categories.

interface Stage {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: UniversalDotCategory;
  sequence: number;
  tasks: StageTask[];
}

📱 Customer Experience (Optional)

QR kód generovaný pri prijatí vozidla

Sledovanie cez lakovna.com/track/{token}

Real-time progres podľa stages

interface CustomerTrackingView {
  vehicle: VehicleInfo;
  currentStage: StageProgress;
  timeline: StageProgress[];
  estimatedCompletion: Date;
  photos?: string[];
}

🧪 Development Guidelines & Conventions
File Naming

Types: [domain].types.ts

Configs: [domain].config.ts

Utils: [domain].utils.ts

Components: [name].[domain].tsx

Import Patterns
// Project-specific type
import { ProjectOrgType } from 'common/types/project/org-type.types';

// Project config
import { PROJECT_ORG_TYPE_MAPPING } from 'common/configs/project/project.config';

// Universal role
import { AccessRole } from 'common/types/universal/access-role.types';

Directory Rules

common/ = jediný zdroj pravdy (types, configs, utils, constants).

back/src/security/ = bezpečnostné utility.

Žiadne duplikácie medzi FE/BE.

🚦 Setup for New Project

Skopíruj template adresár → pomenuj podľa projektu.

Nastav .env files.

Upraviť common/configs/project/project.config.ts & common/types/project/*.

Spusti migrácie a seed databázy.

Deploy.

✅ Toto je úplná dokumentácia v5 Final, doplnená aj o časti z v4 (stages, customer QR, dev guidelines).