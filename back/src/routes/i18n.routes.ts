// File: back/src/routes/i18n.routes.ts
// Last change: Created minimal route for fetching i18n bundles

import { Router } from 'express';
import * as i18nController from '../controllers/i18n.controller.js';

const i18nRouter = Router();

// Example request: /api/i18n/bundle?lc=sk&ns=common
i18nRouter.get('/bundle', i18nController.getTranslationBundle);

export default i18nRouter;
