// File: back/src/core/env-loader.ts
// Last change: Refactored and simplified to use a single, centralized environment loader

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export function load_env() {
  const env_path = resolve(process.cwd(), 'environments/.env');

  if (existsSync(env_path)) {
    try {
      const env_file = readFileSync(env_path, 'utf8');
      env_file.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...value_parts] = trimmed.split('=');
          if (key && value_parts.length > 0) {
            const value = value_parts.join('=').replace(/^["']|["']$/g, '');
            process.env[key.trim()] = value;
          }
        }
      });
      console.log(`[ENV] Loaded environment from ${env_path}`);
    } catch (error) {
      console.error(`[ENV] Failed to load ${env_path}`, error);
    }
  }
}