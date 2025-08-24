// File: back/src/routes/stage.routes.ts
// Last change: Created routes for stage CRUD operations

import { Router } from 'express';
import * as stageController from '../controllers/stage.controller.js';

const stageRouter = Router();

stageRouter.get('/', stageController.getAllStages);
stageRouter.post('/', stageController.createStage);
stageRouter.get('/:id', stageController.getStageById);
stageRouter.put('/:id', stageController.updateStage);
stageRouter.delete('/:id', stageController.deleteStage);

export default stageRouter;
