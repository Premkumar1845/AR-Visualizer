import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

const ALLOWED = ['image/png', 'image/jpeg', 'image/webp'];
const MAX = 25 * 1024 * 1024; // 25 MB

export const uploadMiddleware = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX },
    fileFilter: (_req, file, cb) => {
        if (!ALLOWED.includes(file.mimetype)) {
            return cb(new ApiError(415, `Unsupported media type: ${file.mimetype}`));
        }
        cb(null, true);
    },
});
