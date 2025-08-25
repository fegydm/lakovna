// scripts/dev.js
// Run BE + FE in DEV from monorepo root.
// - Port precedence: platform PORT > .env PORT > 10002

import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import http from "http";

const ROOT_DIR = path.resolve(process.cwd());
const DOTENV = path.join(ROOT_DIR, ".env");

function readEnvFilePorts() {
  let portFromEnvFile = undefined;
  let fePortFromEnvFile = undefined;

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
console.log(`🔧 DEV BACKEND_PORT=${BACKEND_PORT} (${BACKEND_URL})`);
console.log(`🔧 DEV FRONTEND_PORT=${FRONTEND_PORT}`);

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
      if (Date.now() - start > timeoutMs) reject(new Error("Timeout waiting for backend"));
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
