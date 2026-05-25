import { createClient } from '@supabase/supabase-js';
import { env, isSupabaseConfigured } from './env.js';

export const supabase = isSupabaseConfigured
    ? createClient(env.supabase.url, env.supabase.serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    })
    : null;

export function ensureSupabase() {
    if (!supabase) {
        const err = new Error(
            'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env',
        );
        err.statusCode = 503;
        throw err;
    }
    return supabase;
}
