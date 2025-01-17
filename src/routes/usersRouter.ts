import { Router } from 'express';
import { createUserController, deleteUserController, findAllUsersController, findOneUserController, updateUserController } from '../controllers/usersController';

const router: Router = Router();

router.get('/', findAllUsersController);
router.get('/find', findOneUserController);

router.post('/', createUserController);

router.put('/', updateUserController);

router.delete('/', deleteUserController);

export default router;