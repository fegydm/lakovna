// File: back/src/routes/worker.routes.ts
// Last change: Updated Prisma imports to use new aliases

import { Router } from 'express';
import * as workerController from '../controllers/worker.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { WorkerRole } from '@prisma/client';

const workerRouter = Router();

workerRouter.post('/link-password/request', workerController.requestPasswordLink);
workerRouter.post('/link-password/complete', workerController.completePasswordLink);

workerRouter.get('/', protect([WorkerRole.ADMIN]), workerController.getAllWorkers);
workerRouter.get('/:id', protect([WorkerRole.ADMIN]), workerController.getWorkerById);
workerRouter.put('/:id', protect([WorkerRole.ADMIN]), workerController.updateWorker);

export default workerRouter;
