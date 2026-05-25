import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ExternalLink, Share2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { sceneService, type Scene } from '../services/scene.service';

export default function Library() {
    const [scenes, setScenes] = useState<Scene[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        sceneService
            .list()
            .then((d) => setScenes(d.scenes || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const onDelete = async (id: string) => {
        if (!confirm('Delete this scene?')) return;
        try {
            await sceneService.remove(id);
            setScenes((s) => s.filter((x) => x.id !== id));
            toast.success('Scene deleted');
        } catch {
            toast.error('Could not delete scene');
        }
    };

    return (
        <div className="px-4 py-8 sm:px-8 sm:py-12">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <div className="pill mb-4">Library</div>
                        <h1 className="font-manrope text-3xl font-semibold tracking-tight sm:text-4xl">
                            Your <span className="font-editorial italic text-gradient-accent">saved scenes</span>.
                        </h1>
                        <p className="mt-2 text-sm text-text-muted">
                            Reopen previous AR sessions, share spatial layouts, and manage your work.
                        </p>
                    </div>
                    <Link to="/ar" className="btn-primary">
                        <Plus className="h-4 w-4" /> New AR scene
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="aspect-[4/3] animate-pulse rounded-3xl border border-white/[0.06] bg-white/[0.02]"
                            />
                        ))}
                    </div>
                ) : scenes.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-white/[0.08] p-16 text-center">
                        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
                            <Plus className="h-6 w-6 text-accent-soft" />
                        </div>
                        <h3 className="mt-5 font-manrope text-xl font-semibold">No saved scenes yet</h3>
                        <p className="mt-1 text-sm text-text-muted">
                            Launch the AR workspace and save your first spatial layout.
                        </p>
                        <Link to="/ar" className="btn-primary mt-6">
                            Open AR Workspace
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {scenes.map((s, i) => (
                            <motion.div
                                key={s.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="group overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.025]"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-ink-800 to-ink-900">
                                    {s.thumbnail_url ? (
                                        <img
                                            src={s.thumbnail_url}
                                            alt={s.name}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-mesh-accent opacity-50" />
                                    )}
                                    <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] text-white/80 backdrop-blur-xl">
                                        <span>{s.objects?.length ?? 0} objects</span>
                                        <span>{new Date(s.updated_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4">
                                    <div className="min-w-0">
                                        <div className="truncate font-manrope text-sm font-semibold">{s.name}</div>
                                        <div className="truncate text-[11px] text-text-dim">
                                            Updated {new Date(s.updated_at).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${window.location.origin}/ar?scene=${s.id}`);
                                                toast.success('Share link copied');
                                            }}
                                            className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.08] text-text-muted hover:bg-white/[0.04]"
                                        >
                                            <Share2 className="h-3.5 w-3.5" />
                                        </button>
                                        <Link
                                            to={`/ar?scene=${s.id}`}
                                            className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.08] text-text-muted hover:bg-white/[0.04]"
                                        >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(s.id)}
                                            className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.08] text-text-muted hover:bg-rose-500/10 hover:text-rose-400"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
