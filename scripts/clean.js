
// File: lakovna/scripts/clean.js

import { existsSync, rmSync } from 'fs';
import { join } from 'path';

const paths = [
  // Build artifacts
  'back/dist',
  'front/dist',
  
  // Node modules (iba root)
  'node_modules',
  
  // Lock files (iba root)
  'package-lock.json',
  
  // Logs
  'logs',
  'back/logs',
  
  // Temp files
  '.next',
  '.turbo'
];

console.log('🧹 Cleaning Lakovňa project...\n');

paths.forEach(path => {
  const fullPath = join(process.cwd(), path);
  if (existsSync(fullPath)) {
    rmSync(fullPath, { recursive: true, force: true });
    console.log(`✅ Cleaned: ${path}`);
  } else {
    console.log(`⏭️  Skipped: ${path} (not found)`);
  }
});

console.log('\n🎉 Clean completed!');