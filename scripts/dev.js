// File: scripts/dev.js
// Last change: Made universal for root/back/front (auto-detects cwd)

import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import http from "http";

const ROOT_DIR = path.resolve(process.cwd(), "..");
const CURRENT_DIR = path.basename(process.cwd());

// --- Detect where we are ---
const isRoot = CURRENT_DIR === "lakovna"; // root project folder name
const isBack = CURRENT_DIR === "back";
const isFront = CURRENT_DIR === "front";

// --- Ports ---
const DOTENV = path.join(ROOT_DIR, ".env");
function readEnvFilePorts() {
  let portFromEnvFile, fePortFromEnvFile;
  if (fs.existsSync(DOTENV)) {
    const content = fs.readFileSync(DOTENV, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      const val = rest.join("=").replace(/^['"]|['"]$/g, "").trim();
      if (key === "PORT" && val) portFromEnvFile = Number(val);
      if (key === "FRONTEND_URL" && val) {
        const m = val.match(/:(\d{2,5})/);
        if (m) fePortFromEnvFile = Number(m[1]);
      }
    }
  }
  return { portFromEnvFile, fePortFromEnvFile };
}

const { portFromEnvFile, fePortFromEnvFile } = readEnvFilePorts();
const BACKEND_PORT =
  (process.env.PORT ? Number(process.env.PORT) : undefined) ??
  portFromEnvFile ??
  10002;
const FRONTEND_PORT = fePortFromEnvFile ?? 3002;
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;

function run(cmd, args, opts = {}) {
  return spawn(cmd, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    ...opts,
  });
}

let backend, frontend;

function cleanup() {
  console.log("\n🛑 Cleaning up (dev)...");
  if (frontend) frontend.kill("SIGTERM");
  if (backend) backend.kill("SIGTERM");
}
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

// --- Cases ---
if (isBack) {
  console.log("🚀 Starting backend only (dev)...");
  backend = run("npm", ["run", "dev"], { cwd: process.cwd() });
} else if (isFront) {
  console.log("🚀 Starting frontend only (dev)...");
  frontend = run("npm", ["run", "dev"], { cwd: process.cwd() });
} else if (isRoot) {
  console.log("🚀 Starting backend (dev)...");
  backend = run("npm", ["run", "dev:back"]);

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
        if (Date.now() - start > timeoutMs)
          reject(new Error("Timeout waiting for backend"));
        else setTimeout(check, 500);
      };
      check();
    });
  }

  waitForBackend(BACKEND_URL)
    .then(() => {
      console.log("✅ Backend ready. Starting frontend (dev)...");
      frontend = run("npm", ["run", "dev:front"]);
    })
    .catch((err) => {
      console.error("❌ Backend did not start:", err.message);
      cleanup();
      process.exit(1);
    });
} else {
  console.error("❌ Unknown directory. Run from root, back, or front.");
  process.exit(1);
}
