// File: back/src/routes/index.ts
// Last change: Fixed import paths and applied snake_case naming conventions

import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { AccessRole } from 'common/types/access-role.types';

// Import route modules
import auth_router from './auth.routes';
import vehicle_router from './vehicle.routes';
import stage_router from './stage.routes';
import worker_router from './worker.routes';
import dashboard_router from './dashboard.routes';
import public_router from './public.routes';
import i18n_router from './i18n.routes';

export const api_router = Router();

// --- Public Routes ---
api_router.use('/auth', auth_router);
api_router.use('/public', public_router);
api_router.use('/i18n', i18n_router);

// --- Protected Routes (JWT authentication required for all below) ---
api_router.use('/dashboard', protect(), dashboard_router);
api_router.use('/vehicles', protect(), vehicle_router);

// --- Role-Protected Routes (Specific roles required) ---
api_router.use('/stages', protect([AccessRole.MANAGER, AccessRole.SUPERADMIN]), stage_router);
api_router.use('/workers', protect([AccessRole.MANAGER, AccessRole.SUPERADMIN]), worker_router);

// --- Health Check ---
api_router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default api_router;