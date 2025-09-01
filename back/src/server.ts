// File: back/src/server.ts
// Last change: Removed global Passport middleware to resolve type conflicts

import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import path from 'path';
import passport from 'passport'; // Keep import for Google strategy configuration
import { fileURLToPath } from 'url';

// Utilities & Configs
import { loadEnv } from './security/env-loader.js';
import configurePassport from './setup/passport.config.js';
import { WebSocketManager } from './setup/websocket.config.js';

// Middleware
import { customCorsMiddleware } from './middlewares/cors.middleware.js';
import { customCookieParser } from './security/cookie-parser.js';
import { httpLogger } from './security/http-logger.js';
import { sessionMiddleware } from './security/session-middleware.js';
import { userAgentMiddleware } from './security/user-agent-parser.js';
import { errorHandler } from './middlewares/error.middleware.js';

// Routers
import apiRouter from './routes/index.js';

// --- INITIALIZATION ---
loadEnv();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 10002;

// --- CORE MIDDLEWARE ---
app.use(customCorsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(customCookieParser);
app.use(httpLogger);
app.use(userAgentMiddleware);
app.use(sessionMiddleware); // Our custom session handler

// --- AUTHENTICATION CONFIG ---
// We only configure Passport, but don't use it as a global middleware anymore.
// It will be used specifically on the Google OAuth routes.
configurePassport();

// --- API ROUTES ---
app.use('/api', apiRouter);

// --- SERVE STATIC FRONTEND (FOR PRODUCTION) ---
if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const frontDistPath = path.join(__dirname, '..', '..', 'front', 'dist');

  app.use(express.static(frontDistPath));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(frontDistPath, 'index.html'));
  });
}

// --- FINAL ERROR HANDLER ---
app.use(errorHandler);

// --- WEBSOCKET & SERVER START ---
WebSocketManager.initialize(server);

server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV}`);
});
