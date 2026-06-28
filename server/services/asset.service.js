import sharp from 'sharp';
import { ensureSupabase } from '../config/supabase.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { processObject, removeBackground } from '../xr-processing/pipeline.js';

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

        // Remove background first, then optimise
        const bgRemoved = await removeBackground(file.buffer);
        const processed = await sharp(bgRemoved)
            .rotate()
            .resize({ width: 2048, height: 2048, fit: 'inside', withoutEnlargement: true })
            .png({ compressionLevel: 8 })
            .toBuffer();

        const filename = `${userId}/${Date.now()}-${file.originalname.replace(/[^a-z0-9.\-]/gi, '_')}.png`;

        const { error: upErr } = await sb.storage
            .from(env.supabase.bucket)
            .upload(filename, processed, { contentType: 'image/png', upsert: false });
        if (upErr) throw new ApiError(500, `Storage error: ${upErr.message}`);

        const { data: pub } = sb.storage.from(env.supabase.bucket).getPublicUrl(filename);

        // Kick off (synchronously here, async-ready) the XR processing pipeline
        const xr = await processObject(processed, file.mimetype);

        const { data, error } = await sb
            .from('uploaded_assets')
            .insert({
                user_id: userId,
                name: file.originalname,
                mime_type: 'image/png',
                size_bytes: processed.length,
                storage_path: filename,
                preview_url: pub.publicUrl,
                status: 'ready',
                metadata: xr,
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
