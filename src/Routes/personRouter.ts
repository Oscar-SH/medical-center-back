import { Router } from 'express';
import {
    findAllPersonsController,
    findOnePersonController,
    createPersonController,
    updatePersonController,
    deletePersonController,
    restorePersonController
} from '../Controllers';


const router: Router = Router();

router.get('/', findAllPersonsController);
router.get('/:id', findOnePersonController);
router.post('/', createPersonController);
router.put('/', updatePersonController);
router.delete('/', deletePersonController);
router.patch('/', restorePersonController);

export default router;