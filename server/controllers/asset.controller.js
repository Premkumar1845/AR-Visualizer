import { asyncHandler } from '../utils/asyncHandler.js';
import { assetService } from '../services/asset.service.js';
import { ApiError } from '../utils/ApiError.js';

export const assetController = {
    list: asyncHandler(async (req, res) => {
        const assets = await assetService.list(req.user.id);
        res.json({ assets });
    }),

    upload: asyncHandler(async (req, res) => {
        if (!req.file) throw new ApiError(400, 'No file uploaded');
        const asset = await assetService.upload({ userId: req.user.id, file: req.file });
        res.status(201).json({ asset });
    }),

    remove: asyncHandler(async (req, res) => {
        await assetService.remove({ userId: req.user.id, id: req.params.id });
        res.status(204).end();
    }),
};
