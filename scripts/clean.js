// File: scripts/clean.js
// Last change: Made universal clean script for root, back and front

import { existsSync, rmSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BACK = path.join(ROOT, "back");
const FRONT = path.join(ROOT, "front");

const cwd = process.cwd();

let paths = [];
if (cwd === ROOT) {
  // Root clean → všetko
  paths = [
    "back/dist",
    "front/dist",
    "node_modules",
    "package-lock.json",
    "logs",
    "back/logs",
    ".next",
    ".turbo",
  ];
} else if (cwd.startsWith(BACK)) {
  // Backend clean
  paths = ["dist", "node_modules", "package-lock.json", "logs"];
} else if (cwd.startsWith(FRONT)) {
  // Frontend clean
  paths = ["dist", "node_modules", "package-lock.json"];
} else {
  console.log("❌ Unknown working directory. Run from root, back or front.");
  process.exit(1);
}

console.log("🧹 Cleaning project...\n");

paths.forEach((p) => {
  const full = path.join(cwd, p);
  if (existsSync(full)) {
    rmSync(full, { recursive: true, force: true });
    console.log(`✅ Cleaned: ${p}`);
  } else {
    console.log(`⏭️  Skipped: ${p} (not found)`);
  }
});

console.log("\n🎉 Clean completed!");
