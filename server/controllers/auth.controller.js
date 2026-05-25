import { asyncHandler } from '../utils/asyncHandler.js';
import { authService } from '../services/auth.service.js';
import { signToken } from '../middleware/auth.middleware.js';
import { ApiError } from '../utils/ApiError.js';

export const authController = {
    register: asyncHandler(async (req, res) => {
        const user = await authService.register(req.body);
        const token = signToken(user);
        res.status(201).json({ user, token });
    }),

    login: asyncHandler(async (req, res) => {
        const user = await authService.login(req.body);
        const token = signToken(user);
        res.json({ user, token });
    }),

    me: asyncHandler(async (req, res) => {
        const user = await authService.getUserById(req.user.id);
        if (!user) throw new ApiError(404, 'User not found');
        res.json({ user });
    }),

    forgotPassword: asyncHandler(async (_req, res) => {
        // Don't reveal whether the email exists; in production trigger Supabase email magic link.
        res.json({ ok: true });
    }),
};
