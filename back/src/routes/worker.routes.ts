// File: back/src/routes/worker.routes.ts
// Last change: Replaced WorkerRole with AccessRole (common enum)

import { Router } from 'express';
import * as workerController from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { AccessRole } from 'common/types/access-role.types';

const workerRouter = Router();

workerRouter.post('/link-password/request', workerController.requestPasswordLink);
workerRouter.post('/link-password/complete', workerController.completePasswordLink);

workerRouter.get('/', protect([AccessRole.manager, AccessRole.superadmin]), workerController.getAllWorkers);
workerRouter.get('/:id', protect([AccessRole.manager, AccessRole.superadmin]), workerController.getWorkerById);
workerRouter.put('/:id', protect([AccessRole.manager, AccessRole.superadmin]), workerController.updateWorker);

export default workerRouter;
