import { ensureSupabase } from '../config/supabase.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export const assetService = {
    async list(userId) {
        const sb = ensureSupabase();
        const { data, error } = await sb
            .from('uploaded_assets')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw new ApiError(500, error.message);
        return data;
    },

    async upload({ userId, file }) {
        const sb = ensureSupabase();

        // Store the original file as-is; background removal runs client-side via Canvas BFS
        const ext = file.originalname.split('.').pop()?.toLowerCase() || 'png';
        const safeName = file.originalname.replace(/[^a-z0-9.\-]/gi, '_');
        const filename = `${userId}/${Date.now()}-${safeName}`;

        const { error: upErr } = await sb.storage
            .from(env.supabase.bucket)
            .upload(filename, file.buffer, { contentType: file.mimetype, upsert: false });
        if (upErr) throw new ApiError(500, `Storage error: ${upErr.message}`);

        const { data: pub } = sb.storage.from(env.supabase.bucket).getPublicUrl(filename);

        const { data, error } = await sb
            .from('uploaded_assets')
            .insert({
                user_id: userId,
                name: file.originalname,
                mime_type: file.mimetype,
                size_bytes: file.size,
                storage_path: filename,
                preview_url: pub.publicUrl,
                status: 'ready',
            })
            .select('*')
            .single();
        if (error) throw new ApiError(500, error.message);
        return data;
    },

    async remove({ userId, id }) {
        const sb = ensureSupabase();
        const { data: asset, error } = await sb
            .from('uploaded_assets')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .maybeSingle();
        if (error) throw new ApiError(500, error.message);
        if (!asset) throw new ApiError(404, 'Asset not found');

        await sb.storage.from(env.supabase.bucket).remove([asset.storage_path]).catch(() => { });
        const { error: delErr } = await sb.from('uploaded_assets').delete().eq('id', id);
        if (delErr) throw new ApiError(500, delErr.message);
    },
};
