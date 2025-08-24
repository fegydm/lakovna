// File: back/src/routes/vehicle.routes.ts
// Last change: Created routes for vehicle CRUD operations

import { Router } from 'express';
import * as vehicleController from '../controllers/vehicle.controller.js';

const vehicleRouter = Router();

vehicleRouter.get('/', vehicleController.getAllVehicles);
vehicleRouter.post('/', vehicleController.createVehicle);
vehicleRouter.get('/:id', vehicleController.getVehicleById);
vehicleRouter.put('/:id', vehicleController.updateVehicle);
vehicleRouter.delete('/:id', vehicleController.deleteVehicle);

export default vehicleRouter;
