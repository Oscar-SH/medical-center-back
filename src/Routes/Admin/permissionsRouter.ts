import { Router } from 'express';
import { createPermissionController, deletePermissionController, findAllPermissionsController, findOnePermissionController, updatePermissionController } from '../../Controllers';

const router: Router = Router();

router.get('/', findAllPermissionsController);
router.get('/:id', findOnePermissionController);
router.post('/', createPermissionController);
router.put('/', updatePermissionController);
router.delete('/', deletePermissionController);

export default router;