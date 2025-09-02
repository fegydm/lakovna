// File: common/utils/back/env-loader.ts
// Universal environment loader for backend apps in monorepo

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

export function loadEnv() {
  // Preferred: environments/.env (monorepo-wide)
  const envPaths = [
    resolve(process.cwd(), "environments/.env"),
    resolve(process.cwd(), "back/.env"), // fallback for local backend
  ];

  let loaded = false;

  for (const envPath of envPaths) {
    if (existsSync(envPath)) {
      try {
        const envFile = readFileSync(envPath, "utf8");
        envFile.split("\n").forEach((line) => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith("#")) {
            const [key, ...valueParts] = trimmed.split("=");
            if (key && valueParts.length > 0) {
              const value = valueParts.join("=").replace(/^["']|["']$/g, "");
              process.env[key.trim()] = value;
            }
          }
        });
        console.log(`[ENV] Loaded environment from ${envPath}`);
        loaded = true;
        break;
      } catch (error) {
        console.error(`[ENV] Failed to load ${envPath}`, error);
      }
    }
  }

  if (!loaded) {
    console.log("[ENV] No .env file found, relying on system environment");
  }
}
