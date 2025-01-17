import { Router } from 'express';
import { findAllDoctorsController, findOneDoctorController, createDoctorController, updateDoctorController, deleteDoctorController } from '../controllers/doctorsController';


const router: Router = Router();

router.get('/', findAllDoctorsController);
router.get('/find', findOneDoctorController);

router.post('/', createDoctorController);

router.put('/', updateDoctorController);

router.delete('/', deleteDoctorController);

export default router;