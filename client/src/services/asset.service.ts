import { api } from './api';

export interface Asset {
    id: string;
    user_id: string;
    name: string;
    mime_type: string;
    size_bytes: number;
    storage_path: string;
    preview_url: string;
    status: 'processing' | 'ready' | 'failed';
    created_at: string;
}

export const assetService = {
    async list() {
        const { data } = await api.get('/assets');
        return data as { assets: Asset[] };
    },
    async upload(file: File, onProgress?: (p: number) => void) {
        const form = new FormData();
        form.append('file', file);
        const { data } = await api.post('/assets', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (e) => {
                if (e.total && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
            },
        });
        return data as { asset: Asset };
    },
    async remove(id: string) {
        await api.delete(`/assets/${id}`);
    },
};
