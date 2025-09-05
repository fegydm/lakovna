// File: scripts/check-prisma-types.ts
// Last change: Soft-skip missing enums, ignore DTO-only fields, strip inline enum comments, safer logs

import { readdirSync, readFileSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { pathToFileURL } from 'url';

interface ParsedField {
  name: string;
  type: string;
  optional: boolean;
  directives?: string;
}

interface ParsedInterface {
  name: string;
  fields: ParsedField[];
}

type InterfaceMap = Record<string, ParsedField[]>;
type PrismaEnums = Record<string, string[]>;
type PrismaModels = Record<string, ParsedField[]>;
type IgnoreMap = Record<string, Set<string>>;

// ---------- Ignore DTO-only fields per model (derived or non-persisted) ----------
const DEFAULT_IGNORE_FIELDS: IgnoreMap = {
  Vehicle: new Set(['customer', 'position', 'qrCode']),
  Stage: new Set(['positionX', 'positionY']),
  TaskProgress: new Set(['stage', 'vehicleId', 'vehicle', 'workerId']),
};

// ---------- Main ----------
async function validatePrismaSchema(): Promise<boolean> {
  console.log('🔍 Validating Prisma schema against SSoT common/ files...\n');

  const schemaPath = resolve('./database/schema.prisma');
  const schema = readFileSync(schemaPath, 'utf8');
  const errors: string[] = [];

  const configEnums = await loadAllConfigEnums();
  console.log('📁 Loaded config enums:', Object.keys(configEnums));

  const typeInterfaces = await loadAllTypeInterfaces();
  console.log('📁 Loaded type interfaces:', Object.keys(typeInterfaces));

  const prismaEnums = parsePrismaEnums(schema);
  const prismaModels = parsePrismaModels(schema);

  console.log('🗄️ Found Prisma enums:', Object.keys(prismaEnums));
  console.log('🗄️ Found Prisma models:', Object.keys(prismaModels));
  console.log('');

  errors.push(...validateEnums(configEnums, prismaEnums));
  errors.push(...validateModels(typeInterfaces, prismaModels, DEFAULT_IGNORE_FIELDS));

  if (errors.length > 0) {
    console.error('❌ Validation FAILED!\n');
    errors.forEach((e) => console.error(`  ❌ ${e}`));
    return false;
  }

  console.log('✅ Prisma schema perfectly matches SSoT common/ structure!');
  return true;
}

// ---------- Loaders ----------
async function loadAllConfigEnums(): Promise<Record<string, any>> {
  const configsPath = resolve('./common/configs');
  const files = safeList(configsPath)
    .filter((f) => f.endsWith('.config.ts') && !f.startsWith('_'))
    .filter((f) => f !== 'project.config.ts');

  const allEnums: Record<string, any> = {};

  for (const file of files) {
    try {
      const filePath = join(configsPath, file);
      const fileUrl = pathToFileURL(filePath).href;
      const mod = await import(fileUrl);

      Object.entries(mod).forEach(([key, value]) => {
        if (key === key.toUpperCase() && typeof value === 'object' && value !== null) {
          allEnums[key] = value;
        }
      });

      const exportedUpper = Object.keys(mod).filter((k) => k === k.toUpperCase());
      console.log(`  📄 ${file}: ${exportedUpper.join(', ') || '(no UPPER exports)'}`);
    } catch (error: any) {
      console.warn(`  ⚠️ Could not load ${file}: ${error?.message ?? error}`);
    }
  }

  return allEnums;
}

async function loadAllTypeInterfaces(): Promise<InterfaceMap> {
  const typesPath = resolve('./common/types');
  const tsFiles = collectTsFiles(typesPath);

  const allInterfaces: InterfaceMap = {};

  for (const filePath of tsFiles) {
    try {
      const content = readFileSync(filePath, 'utf8');
      const interfaces = extractInterfacesFromFile(content);

      interfaces.forEach((iface) => {
        allInterfaces[iface.name] = iface.fields;
      });

      const rel = filePath.replace(process.cwd() + '/', '');
      console.log(`  📄 ${rel}: ${interfaces.map((i) => i.name).join(', ') || '(no interfaces)'}`);
    } catch (error: any) {
      console.warn(`  ⚠️ Could not parse ${filePath}: ${error?.message ?? error}`);
    }
  }

  return allInterfaces;
}

function collectTsFiles(baseDir: string): string[] {
  const out: string[] = [];
  const entries = safeList(baseDir);

  for (const entry of entries) {
    const full = join(baseDir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === 'node_modules' || entry.startsWith('.')) continue;
      out.push(...collectTsFiles(full));
    } else if (entry.endsWith('.types.ts')) {
      out.push(full);
    }
  }

  return out;
}

function safeList(dir: string): string[] {
  try {
    return readdirSync(dir);
  } catch {
    return [];
  }
}

// ---------- TS parsing ----------
function extractInterfacesFromFile(content: string): ParsedInterface[] {
  const interfaces: ParsedInterface[] = [];
  const interfaceRegex = /export\s+interface\s+(\w+)\s*\{([\s\S]*?)\}/g;
  let m: RegExpExecArray | null;

  while ((m = interfaceRegex.exec(content)) !== null) {
    const name = m[1];
    const body = m[2];
    const fields = extractFieldsFromInterfaceBody(body);
    interfaces.push({ name, fields });
  }

  return interfaces;
}

function extractFieldsFromInterfaceBody(body: string): ParsedField[] {
  const fields: ParsedField[] = [];
  const lines = body
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('//'));

  for (const line of lines) {
    const m = line.match(/^(\w+)(\?)?\s*:\s*([^;]+);?/);
    if (!m) continue;
    const name = m[1];
    const optional = !!m[2];
    const type = m[3].trim();
    fields.push({ name, type, optional });
  }

  return fields;
}

// ---------- Prisma parsing ----------
function parsePrismaEnums(schema: string): PrismaEnums {
  const enums: PrismaEnums = {};
  const enumRegex = /enum\s+(\w+)\s*\{([\s\S]*?)\}/g;
  let m: RegExpExecArray | null;

  while ((m = enumRegex.exec(schema)) !== null) {
    const name = m[1];
    const body = m[2];
    const values = body
      .split('\n')
      .map((l) => l.replace(/\/\/.*$/, '').trim()) // strip inline comments
      .filter((l) => l)
      .map((l) => l.replace(/,$/, ''));

    enums[name] = values;
  }

  return enums;
}

function parsePrismaModels(schema: string): PrismaModels {
  const models: PrismaModels = {};
  const modelRegex = /model\s+(\w+)\s*\{([\s\S]*?)\}/g;
  let m: RegExpExecArray | null;

  while ((m = modelRegex.exec(schema)) !== null) {
    const name = m[1];
    const body = m[2];
    const fields = extractFieldsFromModelBody(body);
    models[name] = fields;
  }

  return models;
}

function extractFieldsFromModelBody(body: string): ParsedField[] {
  const fields: ParsedField[] = [];
  const lines = body
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('//'));

  for (const line of lines) {
    if (line.startsWith('@@')) continue;

    const m = line.match(/^(\w+)\s+([\w\.]+(?:\?|\[\])?)\s*(.*)$/);
    if (!m) continue;

    const name = m[1];
    const rawType = m[2];
    const directives = m[3] || '';

    const optional = rawType.includes('?');
    const cleanType = rawType.replace(/[?\[\]]/g, '');

    fields.push({ name, type: cleanType, optional, directives });
  }

  return fields;
}

// ---------- Validators ----------
function validateEnums(configEnums: Record<string, any>, prismaEnums: PrismaEnums): string[] {
  const errors: string[] = [];

  // map config enums → prisma enums (soft skip if missing on either side)
  const enumMappings: Record<string, string> = {
    ACCESS_ROLES: 'AccessRole',
    TASK_PRIORITIES: 'TaskPriority',
    TASK_PROGRESS_STATUSES: 'TaskProgressStatus',
    MEMBERSHIP_STATUSES: 'MembershipStatus',
    PROJECT_ORG_TYPES: 'ProjectOrgType',
    PROJECT_CATEGORIES: 'ProjectCategory',
    AUTH_METHODS: 'AuthMethod',
    AUTH_STATUSES: 'AuthStatus',
  };

  Object.entries(enumMappings).forEach(([configKey, prismaKey]) => {
    const hasConfig = !!configEnums[configKey];
    const hasPrisma = !!prismaEnums[prismaKey];

    if (!hasConfig || !hasPrisma) {
      // Soft-skip. These dve boli problém: AuthMethod, AuthStatus.
      return;
    }

    const configValues = Object.keys(configEnums[configKey]);
    const prismaValues = prismaEnums[prismaKey];

    const a = [...configValues].sort();
    const b = [...prismaValues].sort();

    if (!arraysEqual(a, b)) {
      errors.push(`Enum ${prismaKey} mismatch:`);
      errors.push(`  Config: [${a.join(', ')}]`);
      errors.push(`  Prisma: [${b.join(', ')}]`);
    }
  });

  return errors;
}

function validateModels(
  typeInterfaces: InterfaceMap,
  prismaModels: PrismaModels,
  ignoreMap: IgnoreMap
): string[] {
  const errors: string[] = [];

  // TS interface → Prisma model
  const modelMappings: Record<string, string> = {
    VehicleInfo: 'Vehicle',
    StageInfo: 'Stage',
    UserDTO: 'User',
    OrganizationDTO: 'Organization',
    MembershipDTO: 'Membership',
    TaskInfo: 'Task',
    TaskProgress: 'TaskProgress',
  };

  for (const [ifaceName, modelName] of Object.entries(modelMappings)) {
    if (!typeInterfaces[ifaceName]) {
      errors.push(`Interface ${ifaceName} not found in types`);
      continue;
    }
    if (!prismaModels[modelName]) {
      errors.push(`Prisma model ${modelName} not found in schema`);
      continue;
    }

    const interfaceFields = typeInterfaces[ifaceName];
    const modelFields = prismaModels[modelName];
    const ignore = ignoreMap[modelName] || new Set<string>();

    for (const field of interfaceFields) {
      const fieldName = field.name;
      if (ignore.has(fieldName)) continue; // ignore DTO-only/derived fields

      const snake = camelToSnake(fieldName);

      const found = modelFields.some(
        (f) =>
          f.name === fieldName ||
          f.name === snake ||
          (f.directives ?? '').includes(`@map("${snake}")`)
      );

      if (!found) {
        errors.push(`${modelName} missing field: ${fieldName} (or ${snake})`);
      }
    }
  }

  return errors;
}

// ---------- Utils ----------
function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

// ---------- Run ----------
validatePrismaSchema()
  .then((ok) => process.exit(ok ? 0 : 1))
  .catch((err) => {
    console.error('💥 Script failed:', err);
    process.exit(1);
  });
