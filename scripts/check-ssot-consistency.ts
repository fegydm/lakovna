// File: scripts/check-ssot-consistency.ts
// Last change: SSOT enforcement for common/configs and common/types

import { readdirSync, readFileSync, statSync } from 'fs';
import { join, resolve } from 'path';

interface Violation { file: string; message: string }

const CONFIGS_DIR = resolve('./common/configs');
const TYPES_DIR = resolve('./common/types');

function main() {
  const violations: Violation[] = [];

  // 1) Check configs: UPPER_CASE const objects with `as const`, no types/interfaces
  for (const f of listFiles(CONFIGS_DIR, (p) => p.endsWith('.config.ts'))) {
    const code = readFileSync(f, 'utf8');

    // No exported types or interfaces in configs
    if (/\bexport\s+(type|interface)\b/.test(code)) {
      violations.push({ file: f, message: 'Configs must not export types or interfaces.' });
    }

    // Find UPPER_CASE objects
    const constObjRegex = /export\s+const\s+([A-Z0-9_]+)\s*=\s*\{/g;
    const found: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = constObjRegex.exec(code))) found.push(m[1]);

    if (found.length === 0) {
      // Allow files that intentionally export a single UPPER const not starting with '{' (e.g., strings)
      if (!/export\s+const\s+[A-Z0-9_]+\s*=/.test(code)) {
        violations.push({ file: f, message: 'Config should export UPPER_CASE constants.' });
      }
    }

    // Require `as const` for literal preservation
    if (!/as\s+const\s*;?/.test(code)) {
      violations.push({ file: f, message: 'Config constants should end with `as const`.' });
    }
  }

  // 2) Check types: no enums, no runtime exports, no manual string unions; encourage typeof/keyof typeof
  for (const f of listFiles(TYPES_DIR, (p) => p.endsWith('.types.ts'))) {
    const code = readFileSync(f, 'utf8');

    // No enums in types (derive from configs instead)
    if (/\benum\s+\w+\s*\{/.test(code)) {
      violations.push({ file: f, message: 'Types must not declare `enum`; derive from configs using typeof/keyof.' });
    }

    // No runtime code in types
    if (/\bexport\s+(const|function|class)\b/.test(code)) {
      violations.push({ file: f, message: 'Types must not export runtime values (`const`, `function`, `class`).' });
    }

    // Manual string-literal unions are forbidden when representing config-driven domains
    const manualUnion = /export\s+type\s+\w+\s*=\s*(['"][^'"]+['"](\s*\|\s*['"][^'"]+['"])\s*)+;?/;
    if (manualUnion.test(code) && !/typeof/.test(code)) {
      violations.push({ file: f, message: 'Avoid manual string unions; use `typeof CONFIG[keyof typeof CONFIG]`.' });
    }

    // Encourage use of typeof/keyof typeof when exporting union types
    const exportedTypeDefs = [...code.matchAll(/export\s+type\s+(\w+)\s*=\s*([^;]+);/g)];
    for (const [, typeName, rhs] of exportedTypeDefs) {
      if (/['"]/ .test(rhs) && !/typeof/.test(rhs)) {
        violations.push({ file: f, message: `Type ${typeName} should be derived via typeof/keyof.` });
      }
    }
  }

  // Output
  if (violations.length) {
    console.error('❌ SSOT violations found:\n');
    for (const v of violations) {
      console.error(`  - ${rel(v.file)}: ${v.message}`);
    }
    process.exit(1);
  } else {
    console.log('✅ SSOT checks passed for common/configs and common/types');
  }
}

function listFiles(dir: string, filter: (p: string) => boolean): string[] {
  const out: string[] = [];
  for (const entry of safeList(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...listFiles(full, filter));
    else if (filter(full)) out.push(full);
  }
  return out;
}

function safeList(dir: string): string[] {
  try { return readdirSync(dir); } catch { return []; }
}

function rel(p: string): string {
  const cwd = process.cwd();
  return p.startsWith(cwd) ? p.slice(cwd.length + 1) : p;
}

main();
