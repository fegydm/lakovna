// File: lakovna/back/src/utils/env-loader.ts
// Purpose: Manual .env loader without dotenv; works in ESM and Render Secret Files.
// Comments in English as requested.

import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

// Lakovňa required environment variables
const REQUIRED_VARS = ["DATABASE_URL", "JWT_SECRET"] as const;

// Lakovňa optional with defaults (will NOT override when process.env already has a value)
const DEFAULT_VALUES: Record<string, string> = {
  NODE_ENV: "development",
  PORT: "10002",
  FRONTEND_URL: "http://localhost:3002",
  LOG_LEVEL: "debug",
  CORS_ORIGIN: "http://localhost:3002",
  MAX_FILE_SIZE: "10485760",
  UPLOAD_PATH: "uploads",
  RFID_TIMEOUT: "300000",
};

// Detect repo root heuristically
function findRepoRoot(startDir: string): string | null {
  let dir = startDir;
  for (let i = 0; i < 10; i++) {
    const pkg = join(dir, "package.json");
    if (existsSync(pkg) && !dir.includes(`${join("node_modules")}`)) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

// Collect candidate files from /etc/secrets on Render
function renderSecretCandidates(): string[] {
  const list: string[] = [];
  const secretsDir = "/etc/secrets";
  if (!existsSync(secretsDir)) return list;
  try {
    const entries = readdirSync(secretsDir);
    // Prefer files named ".env" or ending with ".env", then any file
    const preferred = entries
      .filter((f) => {
        const p = join(secretsDir, f);
        return statSync(p).isFile();
      })
      .sort((a, b) => {
        const score = (name: string) =>
          name === ".env" ? 0 : name.endsWith(".env") ? 1 : 2;
        return score(a) - score(b);
      });
    for (const f of preferred) {
      list.push(join(secretsDir, f));
    }
  } catch {
    // ignore directory read errors
  }
  // Also try a conventional fixed name for convenience
  list.unshift(join(secretsDir, ".env"));
  return Array.from(new Set(list));
}

// Build a prioritized list of candidate .env paths
function candidateEnvPaths(): string[] {
  const paths: string[] = [];
  const cwd = process.cwd(); // e.g. .../lakovna/back when running `npm start` in back

  // ESM-safe __dirname replacement
  const thisFileDir = dirname(fileURLToPath(import.meta.url)); // .../back/src/utils or .../back/dist/utils
  const backDir = resolve(thisFileDir, "..", ".."); // .../lakovna/back
  const maybeRoot = findRepoRoot(backDir) ?? findRepoRoot(cwd) ?? resolve(backDir, "..");

  // 1) Explicit override path via ENV_PATH (highest priority)
  if (process.env.ENV_PATH) {
    paths.push(resolve(process.env.ENV_PATH));
  }

  // 2) Render Secret Files: /etc/secrets/*
  paths.push(...renderSecretCandidates());

  // 3) Monorepo layout: repo root (one level up from back/)
  paths.push(resolve(backDir, "..", ".env"));
  paths.push(resolve(backDir, "..", ".env.local"));

  // 4) back folder (if someone stores local env there)
  paths.push(resolve(backDir, ".env"));
  paths.push(resolve(backDir, ".env.local"));

  // 5) current working directory
  paths.push(resolve(cwd, ".env"));
  paths.push(resolve(cwd, ".env.local"));

  // 6) repo root by walk
  if (maybeRoot) {
    paths.push(resolve(maybeRoot, ".env"));
    paths.push(resolve(maybeRoot, ".env.local"));
  }

  // De-duplicate while preserving order
  return Array.from(new Set(paths));
}

// Parse a simple .env format (KEY=VALUE, support quotes, ignore comments, handle CRLF)
function parseEnvFile(content: string): Record<string, string> {
  const map: Record<string, string> = {};
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;

    const eq = line.indexOf("=");
    if (eq <= 0) continue;

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();

    // Remove surrounding quotes if present
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Strip trailing inline comment that starts with space + #
    const hashAt = value.indexOf(" #");
    if (hashAt > -1) value = value.slice(0, hashAt).trim();

    map[key] = value;
  }
  return map;
}

function loadFirstExistingEnvFile(): string | null {
  const candidates = candidateEnvPaths();
  for (const p of candidates) {
    if (existsSync(p)) {
      try {
        const txt = readFileSync(p, "utf8");
        const kv = parseEnvFile(txt);
        let setCount = 0;
        for (const [k, v] of Object.entries(kv)) {
          // Only set if not already present (e.g., Render injects env vars)
          if (process.env[k] === undefined) {
            process.env[k] = v;
            setCount++;
          }
        }
        console.log(`🎨 [ENV] Loaded env file: ${p} (${setCount} vars)`);
        return p;
      } catch (e) {
        console.error(`🚨 [ENV] Failed to read ${p}:`, e);
        // try next candidate
      }
    }
  }
  return null;
}

export function loadEnv(): void {
  const loadedPath = loadFirstExistingEnvFile();
  if (!loadedPath) {
    console.log("🎨 [ENV] No .env file found, using system environment");
  }

  // Apply defaults for missing values (do NOT override existing env incl. Render $PORT)
  for (const [key, defVal] of Object.entries(DEFAULT_VALUES)) {
    if (process.env[key] === undefined || process.env[key] === "") {
      process.env[key] = defVal;
      console.log(`🎨 [ENV] Using default ${key}=${defVal}`);
    }
  }

  // Validate required variables
  const missing = (REQUIRED_VARS as readonly string[]).filter(
    (key) => !process.env[key] || process.env[key] === ""
  );
  if (missing.length > 0) {
    console.error(`🚨 [ENV] Missing required variables: ${missing.join(", ")}`);
    console.error("🚨 [ENV] Lakovňa cannot start without proper configuration");
    process.exit(1);
  }

  // Log non-sensitive env info
  console.log(`🎨 [ENV] Environment: ${process.env.NODE_ENV}`);
  console.log(`🎨 [ENV] Port: ${process.env.PORT}`);
  console.log(`🎨 [ENV] Frontend: ${process.env.FRONTEND_URL}`);
  console.log(
    `🎨 [ENV] Database URL present: ${process.env.DATABASE_URL ? "✅" : "❌"}`
  );
}
