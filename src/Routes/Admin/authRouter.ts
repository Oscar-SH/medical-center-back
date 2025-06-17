import { Router } from 'express';
import { loginController, userInfoController } from '../../Controllers';

const router: Router = Router();

router.get('/state', userInfoController);

router.post('/login', loginController);
router.post('/logout', loginController);

export default router;