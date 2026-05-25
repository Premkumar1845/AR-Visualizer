import { create } from 'zustand';
import type { SceneObject } from '../services/scene.service';

export type ToolMode = 'move' | 'rotate' | 'scale' | 'select';

interface SceneState {
    objects: SceneObject[];
    selectedId: string | null;
    tool: ToolMode;
    lighting: number;
    reflections: number;
    shadows: boolean;
    color: string;
    add: (obj: Omit<SceneObject, 'id'>) => void;
    remove: (id: string) => void;
    duplicate: (id: string) => void;
    select: (id: string | null) => void;
    update: (id: string, patch: Partial<SceneObject>) => void;
    setTool: (t: ToolMode) => void;
    setLighting: (v: number) => void;
    setReflections: (v: number) => void;
    setShadows: (v: boolean) => void;
    setColor: (c: string) => void;
    clear: () => void;
    load: (objs: SceneObject[]) => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

export const useSceneStore = create<SceneState>((set, get) => ({
    objects: [],
    selectedId: null,
    tool: 'move',
    lighting: 0.8,
    reflections: 0.35,
    shadows: true,
    color: '#8ea7ff',
    add: (obj) => {
        const id = uid();
        set((s) => ({ objects: [...s.objects, { ...obj, id }], selectedId: id }));
    },
    remove: (id) =>
        set((s) => ({
            objects: s.objects.filter((o) => o.id !== id),
            selectedId: s.selectedId === id ? null : s.selectedId,
        })),
    duplicate: (id) => {
        const o = get().objects.find((x) => x.id === id);
        if (!o) return;
        const nid = uid();
        set((s) => ({
            objects: [
                ...s.objects,
                { ...o, id: nid, position: [o.position[0] + 0.3, o.position[1], o.position[2] + 0.3] },
            ],
            selectedId: nid,
        }));
    },
    select: (id) => set({ selectedId: id }),
    update: (id, patch) =>
        set((s) => ({ objects: s.objects.map((o) => (o.id === id ? { ...o, ...patch } : o)) })),
    setTool: (t) => set({ tool: t }),
    setLighting: (v) => set({ lighting: v }),
    setReflections: (v) => set({ reflections: v }),
    setShadows: (v) => set({ shadows: v }),
    setColor: (c) => {
        set({ color: c });
        const sel = get().selectedId;
        if (sel) get().update(sel, { color: c });
    },
    clear: () => set({ objects: [], selectedId: null }),
    load: (objs) => set({ objects: objs, selectedId: null }),
}));
