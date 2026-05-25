import { ensureSupabase } from '../config/supabase.js';
import { ApiError } from '../utils/ApiError.js';

export const sceneService = {
    async list(userId) {
        const sb = ensureSupabase();
        const { data, error } = await sb
            .from('saved_scenes')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });
        if (error) throw new ApiError(500, error.message);
        return data;
    },

    async get({ userId, id }) {
        const sb = ensureSupabase();
        const { data, error } = await sb
            .from('saved_scenes')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .maybeSingle();
        if (error) throw new ApiError(500, error.message);
        if (!data) throw new ApiError(404, 'Scene not found');
        return data;
    },

    async create({ userId, name, objects, thumbnail_url }) {
        const sb = ensureSupabase();
        const { data, error } = await sb
            .from('saved_scenes')
            .insert({ user_id: userId, name, objects, thumbnail_url })
            .select('*')
            .single();
        if (error) throw new ApiError(500, error.message);
        return data;
    },

    async update({ userId, id, patch }) {
        const sb = ensureSupabase();
        const { data, error } = await sb
            .from('saved_scenes')
            .update({ ...patch, updated_at: new Date().toISOString() })
            .eq('id', id)
            .eq('user_id', userId)
            .select('*')
            .single();
        if (error) throw new ApiError(500, error.message);
        if (!data) throw new ApiError(404, 'Scene not found');
        return data;
    },

    async remove({ userId, id }) {
        const sb = ensureSupabase();
        const { error } = await sb
            .from('saved_scenes')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
        if (error) throw new ApiError(500, error.message);
    },
};
