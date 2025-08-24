// File: back/src/routes/public.routes.ts
// Last change: Created public route for customer vehicle tracking

import { Router } from 'express';
import * as publicController from '../controllers/public.controller.js';

const publicRouter = Router();

// This is a public route and does not require authentication
publicRouter.get('/track/:token', publicController.getVehicleByTrackingToken);

export default publicRouter;
