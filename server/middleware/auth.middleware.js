import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export function authMiddleware(req, _res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return next(new ApiError(401, 'Authentication required'));
    try {
        const payload = jwt.verify(token, env.jwt.secret);
        req.user = { id: payload.sub, email: payload.email, name: payload.name };
        return next();
    } catch {
        return next(new ApiError(401, 'Invalid or expired token'));
    }
}

export function signToken(user) {
    return jwt.sign(
        { sub: user.id, email: user.email, name: user.name },
        env.jwt.secret,
        { expiresIn: env.jwt.expiresIn },
    );
}
