import { Router } from 'express';
import { createRoleController, deleteRoleController, findAllRolesController, findOneRoleController, updateRoleController } from '../../Controllers';

const router: Router = Router();

router.get('/', findAllRolesController);
router.get('/:id', findOneRoleController);
router.post('/', createRoleController);
router.put('/', updateRoleController);
router.delete('/', deleteRoleController);

export default router;