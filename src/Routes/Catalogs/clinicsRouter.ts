import { Router } from 'express';
import { getAllClinicsQueryController, findClinicController, createClinicController, updateClinicController, deleteClinicController } from '../../Controllers';

const router: Router = Router();

router.get('/', getAllClinicsQueryController);
router.get('/:id', findClinicController);
router.post('/', createClinicController);
router.put('/', updateClinicController);
router.delete('/', deleteClinicController);

export default router;