import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const details = result.error.flatten();
        console.error('[validate] Validation failed on', req.method, req.path, JSON.stringify(details, null, 2));
        return next(new ApiError(400, 'Validation failed: ' + JSON.stringify(details.fieldErrors), details));
    }
    req.body = result.data;
    next();
};
