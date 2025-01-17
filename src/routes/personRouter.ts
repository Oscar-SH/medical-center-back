import { Router } from 'express';
import { findAllPersonsController, findOnePersonController, createPersonController, updatePersonController, deletePersonController } from '../controllers/personController';


const router: Router = Router();

router.get('/', findAllPersonsController);
router.get('/find', findOnePersonController);

router.post('/', createPersonController);

router.put('/', updatePersonController);

router.delete('/', deletePersonController);

export default router;