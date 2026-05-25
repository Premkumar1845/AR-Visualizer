import { Router } from 'express';
import { z } from 'zod';
import { authController } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

const registerSchema = z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(8).max(128),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

const forgotSchema = z.object({ email: z.string().email() });

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/forgot-password', validate(forgotSchema), authController.forgotPassword);
router.get('/me', authMiddleware, authController.me);

export default router;
