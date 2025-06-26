import { Router } from 'express';
import { createPermissionController, deletePermissionController, findAllPermissionsController, findOnePermissionController, getPermissionsUserController, updatePermissionController } from '../../Controllers';

const router: Router = Router();

router.get('/', findAllPermissionsController);
router.get('/:id(\\d+)', findOnePermissionController);
router.post('/', createPermissionController);
router.put('/', updatePermissionController);
router.delete('/', deletePermissionController);

router.get('/byuser', getPermissionsUserController);

export default router;