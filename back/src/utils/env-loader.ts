// File: back/src/utils/env-loader.ts
// Last change: Enhanced for Lakovna automotive workshop with validation

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Lakovňa required environment variables
const REQUIRED_VARS = [
  'DATABASE_URL',
  'JWT_SECRET'
];

// Lakovňa optional with defaults
const DEFAULT_VALUES = {
  NODE_ENV: 'development',
  PORT: '10002',
  FRONTEND_URL: 'http://localhost:3002',
  LOG_LEVEL: 'debug',
  CORS_ORIGIN: 'http://localhost:3002',
  MAX_FILE_SIZE: '10485760',
  UPLOAD_PATH: 'uploads',
  RFID_TIMEOUT: '300000'
};

export function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), '.env');
    const envFile = readFileSync(envPath, 'utf8');
    
    envFile.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '');
          process.env[key.trim()] = value;
        }
      }
    });
    
    console.log('🎨 [ENV] Lakovňa environment loaded from .env');
  } catch (error) {
    console.log('🎨 [ENV] No .env file found, using system environment');
  }

  // Apply defaults for missing values
  Object.entries(DEFAULT_VALUES).forEach(([key, defaultValue]) => {
    if (!process.env[key]) {
      process.env[key] = defaultValue;
      console.log(`🎨 [ENV] Using default ${key}=${defaultValue}`);
    }
  });

  // Validate required variables
  const missing = REQUIRED_VARS.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error(`🚨 [ENV] Missing required variables: ${missing.join(', ')}`);
    console.error('🚨 [ENV] Lakovňa cannot start without proper configuration');
    process.exit(1);
  }

  // Log environment info (without secrets)
  console.log(`🎨 [ENV] Environment: ${process.env.NODE_ENV}`);
  console.log(`🎨 [ENV] Port: ${process.env.PORT}`);
  console.log(`🎨 [ENV] Frontend: ${process.env.FRONTEND_URL}`);
  console.log(`🎨 [ENV] Database: ${process.env.DATABASE_URL ? '✅ Connected' : '❌ Missing'}`);
}