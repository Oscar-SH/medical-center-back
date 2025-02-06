import { Router } from 'express';
import {
    findAllDoctorsController,
    findOneDoctorController,
    createDoctorController,
    updateDoctorController,
    deleteDoctorController,
    restoreDoctorController
} from '../controllers/doctorsController';

const router: Router = Router();

router.get('/', findAllDoctorsController);
router.get('/:id', findOneDoctorController);
router.post('/', createDoctorController);
router.put('/', updateDoctorController);
router.delete('/', deleteDoctorController);
router.patch('/', restoreDoctorController);

export default router;