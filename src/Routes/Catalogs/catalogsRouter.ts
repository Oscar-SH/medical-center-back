import { Router } from 'express';
import { getCatMunicipalitiesController, getCatStatesController } from '../../Controllers';

const router: Router = Router();

router.get('/states', getCatStatesController);
router.get('/municipalities', getCatMunicipalitiesController);

export default router;