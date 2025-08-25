// scripts/dev.js
// Purpose: Run backend and frontend together in dev mode from monorepo root.
// - Reads PORT and FRONTEND_URL from .env if available
// - Starts backend (workspace back), waits for /health
// - Then starts frontend (workspace front)
// - Cleans up both on Ctrl+C

import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import http from "http";

const ROOT_DIR = path.resolve(process.cwd());
const DOTENV = path.join(ROOT_DIR, ".env");

let BACKEND_PORT = 10002;
let FRONTEND_PORT = 3002;

// --- Parse .env if present ---
if (fs.existsSync(DOTENV)) {
  const content = fs.readFileSync(DOTENV, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    const val = rest.join("=").replace(/^['"]|['"]$/g, "").trim();
    if (key === "PORT" && val) BACKEND_PORT = Number(val);
    if (key === "FRONTEND_URL" && val) {
      const match = val.match(/:(\d{2,5})/);
      if (match) FRONTEND_PORT = Number(match[1]);
    }
  }
}

const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;
console.log(`🔧 Using BACKEND_PORT=${BACKEND_PORT} (URL: ${BACKEND_URL})`);
console.log(`🔧 Using FRONTEND_PORT=${FRONTEND_PORT}`);

// --- Spawn helpers ---
function run(cmd, args, opts = {}) {
  const child = spawn(cmd, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    ...opts,
  });
  return child;
}

let backend, frontend;

function cleanup() {
  console.log("\n🛑 Cleaning up...");
  if (frontend) frontend.kill("SIGTERM");
  if (backend) backend.kill("SIGTERM");
}
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

// --- Start backend ---
console.log("🚀 Starting backend (workspace back)...");
backend = run("npm", ["run", "dev:back"]);

// --- Wait for backend /health ---
function waitForBackend(url, timeoutMs = 60000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    (function check() {
      http
        .get(`${url}/health`, (res) => {
          if (res.statusCode === 200) {
            console.log(`✅ Backend ready at ${url}`);
            resolve();
          } else retry();
        })
        .on("error", retry);
    })();

    function retry() {
      if (Date.now() - start > timeoutMs) {
        reject(new Error("Timeout waiting for backend"));
      } else {
        setTimeout(() => check(), 500);
      }
    }
  });
}

waitForBackend(BACKEND_URL)
  .then(() => {
    console.log("🚀 Starting frontend (workspace front)...");
    frontend = run("npm", ["run", "dev:front"]);
  })
  .catch((err) => {
    console.error("❌ Backend did not start:", err.message);
    cleanup();
    process.exit(1);
  });
