import { api } from './api';

export interface SceneObject {
    id: string;
    assetId?: string;
    textureUrl?: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    color?: string;
    shape?: 'cube' | 'sphere' | 'cylinder' | 'cone' | 'image';
}

export interface Scene {
    id: string;
    user_id: string;
    name: string;
    thumbnail_url?: string | null;
    objects: SceneObject[];
    created_at: string;
    updated_at: string;
}

export const sceneService = {
    async list() {
        const { data } = await api.get('/scenes');
        return data as { scenes: Scene[] };
    },
    async get(id: string) {
        const { data } = await api.get(`/scenes/${id}`);
        return data as { scene: Scene };
    },
    async create(payload: { name: string; objects: SceneObject[]; thumbnail_url?: string }) {
        const { data } = await api.post('/scenes', payload);
        return data as { scene: Scene };
    },
    async update(id: string, payload: Partial<Pick<Scene, 'name' | 'objects' | 'thumbnail_url'>>) {
        const { data } = await api.put(`/scenes/${id}`, payload);
        return data as { scene: Scene };
    },
    async remove(id: string) {
        await api.delete(`/scenes/${id}`);
    },
};
