import bcrypt from 'bcryptjs';
import { supabase, ensureSupabase } from '../config/supabase.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * In-memory fallback when Supabase isn't configured.
 * Lets you smoke-test the API locally without standing up infra.
 */
const memoryUsers = new Map();

function toPublic(u) {
    return { id: u.id, email: u.email, name: u.name, avatar_url: u.avatar_url ?? null };
}

export const authService = {
    async register({ name, email, password }) {
        const password_hash = await bcrypt.hash(password, 12);

        if (!supabase) {
            if (memoryUsers.has(email)) throw new ApiError(409, 'Email already registered');
            const u = { id: crypto.randomUUID(), name, email, password_hash, created_at: new Date().toISOString() };
            memoryUsers.set(email, u);
            return toPublic(u);
        }

        const sb = ensureSupabase();
        const { data: existing } = await sb.from('users').select('id').eq('email', email).maybeSingle();
        if (existing) throw new ApiError(409, 'Email already registered');

        const { data, error } = await sb
            .from('users')
            .insert({ name, email, password_hash })
            .select('id,email,name,avatar_url')
            .single();
        if (error) throw new ApiError(500, error.message);
        return data;
    },

    async login({ email, password }) {
        if (!supabase) {
            const u = memoryUsers.get(email);
            if (!u) throw new ApiError(401, 'Invalid credentials');
            const ok = await bcrypt.compare(password, u.password_hash);
            if (!ok) throw new ApiError(401, 'Invalid credentials');
            return toPublic(u);
        }
        const sb = ensureSupabase();
        const { data, error } = await sb
            .from('users')
            .select('id,email,name,avatar_url,password_hash')
            .eq('email', email)
            .maybeSingle();
        if (error) throw new ApiError(500, error.message);
        if (!data) throw new ApiError(401, 'Invalid credentials');
        const ok = await bcrypt.compare(password, data.password_hash);
        if (!ok) throw new ApiError(401, 'Invalid credentials');
        return toPublic(data);
    },

    async getUserById(id) {
        if (!supabase) {
            const u = [...memoryUsers.values()].find((x) => x.id === id);
            return u ? toPublic(u) : null;
        }
        const sb = ensureSupabase();
        const { data, error } = await sb
            .from('users')
            .select('id,email,name,avatar_url')
            .eq('id', id)
            .maybeSingle();
        if (error) throw new ApiError(500, error.message);
        return data;
    },
};
