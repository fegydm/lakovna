// File: back/src/server.ts
// Last change: Refactored to align with project conventions and simplify logic

import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import path from 'path';
import passport from 'passport';
import { fileURLToPath } from 'url';

// --- UTILITIES & CORE ---
import { load_env } from './core/env.loader';
import { configure_passport } from './core/passport.setup';
import { WebSocketManager } from './core/websocket.manager';

// --- MIDDLEWARE ---
import { custom_cors_middleware } from './middlewares/cors.middleware';
import { cookie_middleware } from './middlewares/cookie.middleware'; 
import { http_logger } from './middlewares/http-logger.middleware';
import { session_middleware } from './middlewares/session.middleware';
import { user_agent_middleware } from './middlewares/user-agent.middleware';
import { error_handler } from './middlewares/error.middleware';

// --- ROUTERS ---
import api_router from './routes/index';

// --- INITIALIZATION ---
load_env();
const app = express();
const server = http.createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const project_root = path.join(__dirname, '../..');
const frontend_dist_path = path.join(project_root, 'front', 'dist');

// --- CORE MIDDLEWARE ---
app.use(custom_cors_middleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie_middleware);
app.use(http_logger);
app.use(user_agent_middleware);
app.use(session_middleware);

// --- AUTHENTICATION ---
configure_passport();

// --- API ROUTES ---
app.use('/api', api_router);

// --- STATIC FRONTEND ---
app.use(express.static(frontend_dist_path));
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.resolve(frontend_dist_path, 'index.html'));
});

// --- FINAL ERROR HANDLER ---
app.use(error_handler);

// --- WEBSOCKETS & SERVER START ---
WebSocketManager.initialize(server);
const PORT = parseInt(process.env.PORT || '10002', 10);
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV}`);
});