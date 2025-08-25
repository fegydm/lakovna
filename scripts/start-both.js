// scripts/start-both.js
// Start BE + FE in "prod" from monorepo root.
// - Backend: uses workspace `back` start (with your prestart build).
// - Frontend: builds then runs `vite preview` on FRONTEND_URL's port (or 3002).
// - Waits for backend /health, then starts FE.
// - Graceful cleanup on Ctrl+C.

import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import http from "http";

const ROOT_DIR = path.resolve(process.cwd());
const DOTENV = path.join(ROOT_DIR, ".env");

let BACKEND_PORT = 10002;
let FRONTEND_PORT = 3002;

if (fs.existsSync(DOTENV)) {
  const content = fs.readFileSync(DOTENV, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    const val = rest.join("=").replace(/^['"]|['"]$/g, "").trim();
    if (key === "PORT" && val) BACKEND_PORT = Number(val);
    if (key === "FRONTEND_URL" && val) {
      const m = val.match(/:(\d{2,5})/);
      if (m) FRONTEND_PORT = Number(m[1]);
    }
  }
}

const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;
console.log(`🔧 PROD BACKEND_PORT=${BACKEND_PORT} (${BACKEND_URL})`);
console.log(`🔧 PROD FRONTEND_PORT=${FRONTEND_PORT}`);

function run(cmd, args, opts = {}) {
  return spawn(cmd, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    ...opts,
  });
}

let backend, frontBuild, frontPreview;

function cleanup() {
  console.log("\n🛑 Cleaning up (prod)...");
  if (frontPreview) frontPreview.kill("SIGTERM");
  if (backend) backend.kill("SIGTERM");
  if (frontBuild) frontBuild.kill("SIGTERM");
}
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

// --- Start backend in prod ---
// This uses back/package.json: prestart -> build, start -> node dist/server.js
console.log("🚀 Starting backend (prod)...");
backend = run("npm", ["start", "-w", "back"]);

function waitForBackend(url, timeoutMs = 60000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      http.get(`${url}/health`, (res) => {
        if (res.statusCode === 200) resolve();
        else retry();
      }).on("error", retry);
    };
    const retry = () => {
      if (Date.now() - start > timeoutMs) reject(new Error("Timeout waiting for backend"));
      else setTimeout(check, 500);
    };
    check();
  });
}

waitForBackend(BACKEND_URL)
  .then(() => {
    console.log("✅ Backend ready. Building frontend for preview...");
    // Build frontend
    frontBuild = run("npm", ["run", "build", "-w", "front"]);
    frontBuild.on("exit", (code) => {
      if (code !== 0) {
        console.error("❌ Frontend build failed.");
        cleanup();
        process.exit(code ?? 1);
      }
      console.log("🚀 Starting frontend preview (prod-like)...");
      // Run vite preview with explicit port
      frontPreview = run("npm", ["run", "preview", "-w", "front", "--", "--port", String(FRONTEND_PORT), "--strictPort"]);
    });
  })
  .catch((err) => {
    console.error("❌ Backend did not start:", err.message);
    cleanup();
    process.exit(1);
  });
