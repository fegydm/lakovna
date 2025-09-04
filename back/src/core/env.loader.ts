// File: back/src/core/env-loader.ts
// Last change: Refactored to be a clean, dependency-free environment loader using project naming conventions.

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export function loadEnv() {
  const envPath = resolve(process.cwd(), 'environments/.env');

  if (existsSync(envPath)) {
    try {
      const envFile = readFileSync(envPath, 'utf8');
      envFile.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=').replace(/^["']|["']$/g, '');
            process.env[key.trim()] = value;
          }
        }
      });
      console.log(`[ENV] Loaded environment from ${envPath}`);
    } catch (error) {
      console.error(`[ENV] Failed to load ${envPath}`, error);
    }
  }
}