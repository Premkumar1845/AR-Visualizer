import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    UploadCloud,
    Sparkles,
    FolderHeart,
    Layers3,
    Activity,
    HardDrive,
    ArrowUpRight,
    Cpu,
    Clock,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useEffect, useState } from 'react';
import { assetService, type Asset } from '../services/asset.service';
import { sceneService, type Scene } from '../services/scene.service';

export default function Dashboard() {
    const { user } = useAuthStore();
    const [assets, setAssets] = useState<Asset[]>([]);
    const [scenes, setScenes] = useState<Scene[]>([]);

    useEffect(() => {
        Promise.all([assetService.list(), sceneService.list()])
            .then(([a, s]) => {
                setAssets(a.assets || []);
                setScenes(s.scenes || []);
            })
            .catch(() => { });
    }, []);

    const storageUsed = assets.reduce((acc, a) => acc + (a.size_bytes || 0), 0) / (1024 * 1024);
    const storageCap = 500;

    return (
        <div className="px-4 py-8 sm:px-8 sm:py-12">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 xl:grid-cols-[1fr_320px]">
                {/* Main */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="pill mb-4">
                            <Activity className="h-3 w-3" /> Spatial Status · Online
                        </div>
                        <h1 className="font-manrope text-3xl font-semibold tracking-tight sm:text-4xl">
                            Welcome back,{' '}
                            <span className="font-editorial italic text-gradient-accent">
                                {user?.name?.split(' ')[0] ?? 'Creator'}
                            </span>
                            .
                        </h1>
                        <p className="mt-2 text-sm text-text-muted">
                            Your spatial workspace is ready. Upload an asset, jump into AR, or revisit a saved scene.
                        </p>
                    </motion.div>

                    {/* Quick actions */}
                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            { to: '/upload', icon: UploadCloud, t: 'Upload Object', d: 'Drag & drop or scan a real-world object.' },
                            { to: '/ar', icon: Sparkles, t: 'Launch AR Workspace', d: 'Place objects in your environment.', featured: true },
                            { to: '/library', icon: FolderHeart, t: 'Saved Scenes', d: 'Reopen and manage spatial layouts.' },
                        ].map((c) => (
                            <Link
                                key={c.to}
                                to={c.to}
                                className={`group relative overflow-hidden rounded-3xl border p-6 transition-all hover:-translate-y-0.5 ${c.featured
                                        ? 'border-accent/30 bg-gradient-to-br from-accent/[0.1] to-white/[0.02] shadow-glow'
                                        : 'border-white/[0.06] bg-white/[0.025] hover:bg-white/[0.04]'
                                    }`}
                            >
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04]">
                                        <c.icon className="h-4 w-4 text-accent-soft" />
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-text-dim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                </div>
                                <div className="font-manrope text-lg font-semibold">{c.t}</div>
                                <div className="mt-1 text-sm text-text-muted">{c.d}</div>
                            </Link>
                        ))}
                    </div>

                    {/* Spatial Library + Sessions */}
                    <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.025] p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Layers3 className="h-4 w-4 text-accent-soft" />
                                    <div className="font-manrope text-sm font-semibold">Spatial Library</div>
                                </div>
                                <Link to="/library" className="text-xs text-text-muted hover:text-text-primary">
                                    View all
                                </Link>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {(assets.slice(0, 6).length ? assets.slice(0, 6) : Array.from({ length: 6 })).map(
                                    (a: any, i) => (
                                        <div
                                            key={a?.id ?? i}
                                            className="relative aspect-square overflow-hidden rounded-xl border border-white/[0.05] bg-gradient-to-br from-white/[0.04] to-transparent"
                                        >
                                            {a?.preview_url ? (
                                                <img src={a.preview_url} alt={a.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 grid place-items-center text-[10px] text-text-dim">
                                                    empty slot
                                                </div>
                                            )}
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.025] p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-accent-soft" />
                                    <div className="font-manrope text-sm font-semibold">Recent Sessions</div>
                                </div>
                            </div>
                            <ul className="space-y-2">
                                {(scenes.slice(0, 4).length ? scenes.slice(0, 4) : []).map((s) => (
                                    <li
                                        key={s.id}
                                        className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5"
                                    >
                                        <div>
                                            <div className="text-sm">{s.name}</div>
                                            <div className="text-[11px] text-text-dim">
                                                {new Date(s.updated_at).toLocaleString()}
                                            </div>
                                        </div>
                                        <Link to="/ar" className="text-xs text-accent-soft">
                                            Reopen
                                        </Link>
                                    </li>
                                ))}
                                {!scenes.length && (
                                    <li className="rounded-xl border border-dashed border-white/[0.08] p-6 text-center text-xs text-text-dim">
                                        No saved sessions yet. Launch the AR workspace and save your first scene.
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Analytics */}
                    <div className="mt-8 rounded-3xl border border-white/[0.06] bg-white/[0.025] p-6">
                        <div className="mb-4 flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-accent-soft" />
                            <div className="font-manrope text-sm font-semibold">Analytics</div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {[
                                { k: assets.length, v: 'Assets' },
                                { k: scenes.length, v: 'Scenes' },
                                { k: '60', v: 'FPS Avg', s: 'fps' },
                                { k: storageUsed.toFixed(1), v: 'MB used', s: 'MB' },
                            ].map((m) => (
                                <div key={m.v} className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4">
                                    <div className="font-manrope text-2xl font-semibold">{m.k}</div>
                                    <div className="mt-1 text-[11px] uppercase tracking-widest text-text-dim">{m.v}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right sidebar */}
                <aside className="space-y-4">
                    <div className="rounded-3xl border border-white/[0.06] bg-white/[0.025] p-6">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-soft text-sm font-semibold">
                                {user?.name?.[0]?.toUpperCase() ?? 'U'}
                            </div>
                            <div className="min-w-0">
                                <div className="truncate font-manrope text-sm font-semibold">{user?.name}</div>
                                <div className="truncate text-xs text-text-muted">{user?.email}</div>
                            </div>
                        </div>
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs text-text-muted">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                    <HardDrive className="h-3.5 w-3.5" /> Storage
                                </span>
                                <span>
                                    {storageUsed.toFixed(0)} / {storageCap} MB
                                </span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                                <div
                                    className="h-full bg-gradient-to-r from-accent to-accent-soft"
                                    style={{ width: `${Math.min(100, (storageUsed / storageCap) * 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/[0.06] bg-white/[0.025] p-6">
                        <div className="mb-3 font-manrope text-sm font-semibold">Recent Uploads</div>
                        <ul className="space-y-2">
                            {assets.slice(0, 4).map((a) => (
                                <li
                                    key={a.id}
                                    className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-2"
                                >
                                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-white/[0.04]">
                                        {a.preview_url && (
                                            <img src={a.preview_url} alt={a.name} className="h-full w-full object-cover" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-xs">{a.name}</div>
                                        <div className="text-[10px] text-text-dim">
                                            {(a.size_bytes / 1024).toFixed(0)} KB
                                        </div>
                                    </div>
                                </li>
                            ))}
                            {!assets.length && (
                                <li className="rounded-xl border border-dashed border-white/[0.08] p-4 text-center text-xs text-text-dim">
                                    No uploads yet.
                                </li>
                            )}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
