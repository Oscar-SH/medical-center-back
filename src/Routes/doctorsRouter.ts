import { Router } from 'express';
import { findAllDoctorsController, findOneDoctorController, updateDoctorController } from '../Controllers';

const router: Router = Router();

router.get('/', findAllDoctorsController);
router.get('/:id', findOneDoctorController);
router.put('/', updateDoctorController);

export default router;