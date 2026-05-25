import dotenv from 'dotenv';
dotenv.config();

export const env = {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    jwt: {
        secret: process.env.JWT_SECRET || 'dev-only-change-me',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    supabase: {
        url: process.env.SUPABASE_URL || '',
        serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
        bucket: process.env.SUPABASE_STORAGE_BUCKET || 'ar-assets',
    },
};

// Treat obvious placeholder values from .env.example as "not configured" so
// the API falls back to the in-memory auth store instead of trying to hit a
// non-existent host (which surfaces as "TypeError: fetch failed").
const looksLikePlaceholder = (v) =>
    !v ||
    v.includes('your-project') ||
    v.includes('your-anon-key') ||
    v.startsWith('your-') ||
    v.startsWith('PASTE_') ||
    v.includes('PASTE_YOUR') ||
    v === 'changeme';

export const isSupabaseConfigured =
    Boolean(env.supabase.url && env.supabase.serviceKey) &&
    !looksLikePlaceholder(env.supabase.url) &&
    !looksLikePlaceholder(env.supabase.serviceKey);
