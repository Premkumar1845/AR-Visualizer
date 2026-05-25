import { asyncHandler } from '../utils/asyncHandler.js';
import { sceneService } from '../services/scene.service.js';

export const sceneController = {
    list: asyncHandler(async (req, res) => {
        const scenes = await sceneService.list(req.user.id);
        res.json({ scenes });
    }),

    get: asyncHandler(async (req, res) => {
        const scene = await sceneService.get({ userId: req.user.id, id: req.params.id });
        res.json({ scene });
    }),

    create: asyncHandler(async (req, res) => {
        const scene = await sceneService.create({
            userId: req.user.id,
            name: req.body.name,
            objects: req.body.objects,
            thumbnail_url: req.body.thumbnail_url,
        });
        res.status(201).json({ scene });
    }),

    update: asyncHandler(async (req, res) => {
        const scene = await sceneService.update({
            userId: req.user.id,
            id: req.params.id,
            patch: req.body,
        });
        res.json({ scene });
    }),

    remove: asyncHandler(async (req, res) => {
        await sceneService.remove({ userId: req.user.id, id: req.params.id });
        res.status(204).end();
    }),
};
