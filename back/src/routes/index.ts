// File: back/src/routes/index.ts
// Last change: Replaced Prisma WorkerRole with common AccessRole enum

import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { AccessRole } from 'common/types/access-role.types';

// Import route modules
import authRouter from './auth.routes.js';
import vehicleRouter from './vehicle.routes.js';
import stageRouter from './stage.routes.js';
import workerRouter from './worker.routes.js';
import dashboardRouter from './dashboard.routes.js';
import publicRouter from './public.routes.js';
import i18nRouter from './i18n.routes.js';

const apiRouter = Router();

// --- Public Routes ---
apiRouter.use('/auth', authRouter);
apiRouter.use('/public', publicRouter);
apiRouter.use('/i18n', i18nRouter);

// --- Protected Routes (JWT authentication required for all below) ---
apiRouter.use('/dashboard', protect(), dashboardRouter);
apiRouter.use('/vehicles', protect(), vehicleRouter);

// --- Role-Protected Routes (Specific roles required) ---
apiRouter.use('/stages', protect([AccessRole.manager, AccessRole.superadmin]), stageRouter);
apiRouter.use('/workers', protect([AccessRole.manager, AccessRole.superadmin]), workerRouter);

// --- Health Check ---
apiRouter.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default apiRouter;
