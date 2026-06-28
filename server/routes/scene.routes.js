import { Router } from 'express';
import { z } from 'zod';
import { sceneController } from '../controllers/scene.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();
router.use(authMiddleware);

const objectSchema = z.object({
    id: z.string(),
    assetId: z.string().nullish(),
    textureUrl: z.string().nullish(),
    position: z.array(z.number()).length(3),
    rotation: z.array(z.number()).length(3),
    scale: z.array(z.number()).length(3),
    color: z.string().nullish(),
    shape: z.enum(['cube', 'sphere', 'cylinder', 'cone', 'image']).nullish(),
}).passthrough();

const createSchema = z.object({
    name: z.string().min(1).max(120),
    objects: z.array(objectSchema),
    thumbnail_url: z.string().url().nullish(),
});

const updateSchema = z.object({
    name: z.string().min(1).max(120).optional(),
    objects: z.array(objectSchema).optional(),
    thumbnail_url: z.string().url().nullish(),
});

router.get('/', sceneController.list);
router.get('/:id', sceneController.get);
router.post('/', validate(createSchema), sceneController.create);
router.put('/:id', validate(updateSchema), sceneController.update);
router.delete('/:id', sceneController.remove);

export default router;
