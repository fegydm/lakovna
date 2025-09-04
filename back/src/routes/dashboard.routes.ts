// File: back/src/routes/dashboard.routes.ts
import { Router } from 'express';
import { getDashboardStats, getDashboardAlerts } from '../controllers/dashboard.controller';
import { protect } from '../middlewares/jwt-auth.middleware';
import { AccessRole } from 'common/types/access-role.types';

const router = Router();

// Dashboard je len pre vlastníkov a manažérov
router.get('/stats', protect([AccessRole.OWNER, AccessRole.MANAGER]), getDashboardStats);
router.get('/alerts', protect([AccessRole.OWNER, AccessRole.MANAGER]), getDashboardAlerts);

export default router;
