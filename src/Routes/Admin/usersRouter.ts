import { Router } from 'express';
import { createUserController, deleteUserController, findAllUsersController, findOneUserController, resetPasswordController, updateUserController } from '../../Controllers';

const router: Router = Router();

router.get('/', findAllUsersController);
router.get('/:id', findOneUserController);
router.post('/', createUserController);
router.put('/', updateUserController);
router.delete('/', deleteUserController);
router.patch('/', resetPasswordController);

export default router;