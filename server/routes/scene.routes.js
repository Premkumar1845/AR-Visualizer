import { Router } from 'express';
import { sceneController } from '../controllers/scene.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();
router.use(authMiddleware);

router.get('/', sceneController.list);
router.get('/:id', sceneController.get);
router.post('/', sceneController.create);
router.put('/:id', sceneController.update);
router.delete('/:id', sceneController.remove);

export default router;
