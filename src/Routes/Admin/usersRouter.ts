import { Router } from 'express';
import {
    createUserController,
    deleteUserController,
    findAllUsersController,
    findOneUserController,
    getPrivilegesUserController,
    resetPasswordController,
    setPrivilegesUserController,
    updateUserController
} from '../../Controllers';

const router: Router = Router();

router.get('/', findAllUsersController);
router.get('/:id(\\d+)', findOneUserController);
router.post('/', createUserController);
router.put('/', updateUserController);
router.delete('/', deleteUserController);
router.patch('/', resetPasswordController);

router.get('/privileges', getPrivilegesUserController);
router.post('/privileges', setPrivilegesUserController);

export default router;