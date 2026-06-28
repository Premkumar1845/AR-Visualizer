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
        const name = (req.body.name || '').trim() || 'Untitled Spatial Scene';
        const objects = Array.isArray(req.body.objects) ? req.body.objects : [];
        const scene = await sceneService.create({
            userId: req.user.id,
            name,
            objects,
            thumbnail_url: req.body.thumbnail_url || null,
        });
        res.status(201).json({ scene });
    }),

    update: asyncHandler(async (req, res) => {
        const patch = {};
        if (req.body.name !== undefined) patch.name = (req.body.name || '').trim() || 'Untitled Spatial Scene';
        if (req.body.objects !== undefined) patch.objects = Array.isArray(req.body.objects) ? req.body.objects : [];
        if (req.body.thumbnail_url !== undefined) patch.thumbnail_url = req.body.thumbnail_url || null;
        const scene = await sceneService.update({
            userId: req.user.id,
            id: req.params.id,
            patch,
        });
        res.json({ scene });
    }),

    remove: asyncHandler(async (req, res) => {
        await sceneService.remove({ userId: req.user.id, id: req.params.id });
        res.status(204).end();
    }),
};
