import { Router } from 'express';
import { assetController } from '../controllers/asset.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { uploadMiddleware } from '../middleware/upload.middleware.js';

const router = Router();
router.use(authMiddleware);

router.get('/', assetController.list);
router.post('/', uploadMiddleware.single('file'), assetController.upload);
router.delete('/:id', assetController.remove);

export default router;
