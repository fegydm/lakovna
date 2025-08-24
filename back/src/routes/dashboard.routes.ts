// File: back/src/routes/dashboard.routes.ts
// Last change: Created routes for dashboard data

import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';

const dashboardRouter = Router();

// This route will be protected by the global JWT middleware in index.ts
dashboardRouter.get('/stats', dashboardController.getDashboardStats);

export default dashboardRouter;
