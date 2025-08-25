// lakovna/scripts/clean.js
import { existsSync, rmSync } from 'fs';
import { join } from 'path';

const paths = [
  // Build artifacts
  'back/dist',
  'front/dist', 
  'common/dist',
  'logger/dist',
  
  // Node modules
  'node_modules',
  'back/node_modules',
  'front/node_modules',
  'common/node_modules',
  'logger/node_modules',
  
  // Lock files
  'package-lock.json',
  'back/package-lock.json',
  'front/package-lock.json',
  'common/package-lock.json',
  'logger/package-lock.json',
  
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
