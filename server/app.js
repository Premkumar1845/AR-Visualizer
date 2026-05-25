import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env, isSupabaseConfigured } from './config/env.js';

import authRoutes from './routes/auth.routes.js';
import assetRoutes from './routes/asset.routes.js';
import sceneRoutes from './routes/scene.routes.js';

import { errorMiddleware, notFoundMiddleware } from './middleware/error.middleware.js';

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
    cors({
        origin: env.clientOrigin === '*' ? true : env.clientOrigin.split(',').map((s) => s.trim()),
        credentials: false,
    }),
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
if (env.nodeEnv !== 'test') app.use(morgan('dev'));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 600,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', apiLimiter);

app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'ar-visualizer-api',
        version: '3.2.0',
        supabase: isSupabaseConfigured ? 'connected' : 'not-configured',
        uptime: process.uptime(),
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/scenes', sceneRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
