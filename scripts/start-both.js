// scripts/start-both.js
// Start BE + FE in "prod-like" from monorepo root.
// - Port precedence: platform PORT > .env PORT > 10002
// - Waits for backend /health then starts FE preview.
// - Do not use this script on Render Web Service; use `node back/dist/server.js`.

import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import http from "http";

const ROOT_DIR = path.resolve(process.cwd());
const DOTENV = path.join(ROOT_DIR, ".env");

function readEnvFile() {
  let portFromEnvFile = undefined;
  let fePortFromEnvFile = undefined;
  let feUrlFromEnvFile = undefined;

  if (fs.existsSync(DOTENV)) {
    const content = fs.readFileSync(DOTENV, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      const val = rest.join("=").replace(/^['"]|['"]$/g, "").trim();
      if (key === "PORT" && val) portFromEnvFile = Number(val);
      if (key === "FRONTEND_URL" && val) {
        feUrlFromEnvFile = val;
        const m = val.match(/:(\d{2,5})/);
        if (m) fePortFromEnvFile = Number(m[1]);
      }
    }
  }
  return { portFromEnvFile, fePortFromEnvFile, feUrlFromEnvFile };
}

const { portFromEnvFile, fePortFromEnvFile, feUrlFromEnvFile } = readEnvFile();

const BACKEND_PORT =
  (process.env.PORT ? Number(process.env.PORT) : undefined) ??
  portFromEnvFile ??
  10002;

const FRONTEND_PORT = fePortFromEnvFile ?? 3002;
const FRONTEND_URL = feUrlFromEnvFile ?? `http://localhost:${FRONTEND_PORT}`;

const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;
console.log(`🔧 PROD BACKEND_PORT=${BACKEND_PORT} (${BACKEND_URL})`);
console.log(`🔧 PROD FRONTEND=${FRONTEND_URL}`);

function run(cmd, args, opts = {}) {
  return spawn(cmd, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    ...opts,
  });
}

let backend, frontBuild, frontPreview;

function cleanup() {
  console.log("\n🛑 Cleaning up (prod-like)...");
  if (frontPreview) frontPreview.kill("SIGTERM");
  if (backend) backend.kill("SIGTERM");
  if (frontBuild) frontBuild.kill("SIGTERM");
}
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

// --- Start backend (uses back/package.json start -> node dist/server.js) ---
console.log("🚀 Starting backend (prod-like)...");
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
    console.log("✅ Backend ready. Building frontend...");
    frontBuild = run("npm", ["run", "build", "-w", "front"]);
    frontBuild.on("exit", (code) => {
      if (code !== 0) {
        console.error("❌ Frontend build failed.");
        cleanup();
        process.exit(code ?? 1);
      }
      console.log("🚀 Starting frontend preview...");
      frontPreview = run("npm", [
        "run",
        "preview",
        "-w",
        "front",
        "--",
        "--port",
        String(FRONTEND_PORT),
        "--strictPort",
      ]);
      console.log(`✅ Frontend ready at ${FRONTEND_URL}`);
    });
  })
  .catch((err) => {
    console.error("❌ Backend did not start:", err.message);
    cleanup();
    process.exit(1);
  });
