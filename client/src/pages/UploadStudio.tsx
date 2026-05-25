import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, ImageIcon, Camera, Check, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { assetService, type Asset } from '../services/asset.service';

interface PendingItem {
    id: string;
    file: File;
    preview: string;
    progress: number;
    status: 'uploading' | 'done' | 'error';
}

const ACCEPT = ['image/png', 'image/jpeg', 'image/webp'];

export default function UploadStudio() {
    const [dragOver, setDragOver] = useState(false);
    const [pending, setPending] = useState<PendingItem[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        assetService.list().then((d) => setAssets(d.assets || [])).catch(() => { });
    }, []);

    const handleFiles = useCallback(async (fileList: FileList | File[]) => {
        const files = Array.from(fileList).filter((f) => ACCEPT.includes(f.type));
        if (!files.length) {
            toast.error('Only PNG · JPG · WebP supported');
            return;
        }
        for (const file of files) {
            const id = Math.random().toString(36).slice(2);
            const preview = URL.createObjectURL(file);
            setPending((p) => [...p, { id, file, preview, progress: 0, status: 'uploading' }]);
            try {
                const { asset } = await assetService.upload(file, (pct) => {
                    setPending((p) => p.map((x) => (x.id === id ? { ...x, progress: pct } : x)));
                });
                setPending((p) => p.map((x) => (x.id === id ? { ...x, status: 'done', progress: 100 } : x)));
                setAssets((a) => [asset, ...a]);
                toast.success(`${file.name} uploaded`);
            } catch (err: any) {
                setPending((p) => p.map((x) => (x.id === id ? { ...x, status: 'error' } : x)));
                toast.error(err?.response?.data?.message || `Failed: ${file.name}`);
            }
        }
    }, []);

    return (
        <div className="px-4 py-8 sm:px-8 sm:py-12">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <div className="pill mb-4">Upload Studio</div>
                    <h1 className="font-manrope text-3xl font-semibold tracking-tight sm:text-4xl">
                        Bring your objects into the{' '}
                        <span className="font-editorial italic text-gradient-accent">spatial layer</span>.
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-text-muted">
                        Drop in photos of real objects. Our processing pipeline will remove backgrounds, detect
                        edges, and prep your assets for AR placement.
                    </p>
                </div>

                {/* Dropzone */}
                <motion.div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragOver(false);
                        handleFiles(e.dataTransfer.files);
                    }}
                    animate={{ scale: dragOver ? 1.005 : 1 }}
                    className={`relative overflow-hidden rounded-3xl border-2 border-dashed p-10 text-center transition-colors ${dragOver
                            ? 'border-accent/60 bg-accent/[0.05]'
                            : 'border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.03]'
                        }`}
                >
                    <div className="absolute inset-0 -z-10 bg-mesh-accent opacity-40" />
                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        accept={ACCEPT.join(',')}
                        className="hidden"
                        onChange={(e) => e.target.files && handleFiles(e.target.files)}
                    />
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
                        <UploadCloud className="h-6 w-6 text-accent-soft" />
                    </div>
                    <h3 className="mt-5 font-manrope text-xl font-semibold">Drop objects to upload</h3>
                    <p className="mt-1 text-sm text-text-muted">
                        PNG · JPG · WebP up to 25 MB each. Drag & drop or click to browse.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                        <button onClick={() => inputRef.current?.click()} className="btn-primary">
                            <ImageIcon className="h-4 w-4" /> Browse Files
                        </button>
                        <button
                            onClick={() => toast('Camera scan requires HTTPS + mobile device', { icon: 'ⓘ' })}
                            className="btn-ghost"
                        >
                            <Camera className="h-4 w-4" /> Scan With Camera
                        </button>
                    </div>
                </motion.div>

                {/* Pending */}
                <AnimatePresence>
                    {pending.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-8"
                        >
                            <div className="mb-3 text-xs uppercase tracking-[0.2em] text-text-dim">Processing</div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {pending.map((p) => (
                                    <div
                                        key={p.id}
                                        className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3"
                                    >
                                        <img
                                            src={p.preview}
                                            alt={p.file.name}
                                            className="h-14 w-14 rounded-lg object-cover"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="truncate text-sm">{p.file.name}</div>
                                            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                                                <div
                                                    className={`h-full transition-all ${p.status === 'error'
                                                            ? 'bg-rose-400'
                                                            : 'bg-gradient-to-r from-accent to-accent-soft'
                                                        }`}
                                                    style={{ width: `${p.progress}%` }}
                                                />
                                            </div>
                                            <div className="mt-1 text-[11px] text-text-dim">
                                                {p.status === 'uploading' && `${p.progress}%`}
                                                {p.status === 'done' && 'Ready · AR-prepared'}
                                                {p.status === 'error' && 'Upload failed'}
                                            </div>
                                        </div>
                                        {p.status === 'uploading' && (
                                            <Loader2 className="h-4 w-4 animate-spin text-text-muted" />
                                        )}
                                        {p.status === 'done' && <Check className="h-4 w-4 text-emerald-400" />}
                                        {p.status === 'error' && <X className="h-4 w-4 text-rose-400" />}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Library */}
                <div className="mt-12">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-manrope text-lg font-semibold">Your Assets</h2>
                        <span className="text-xs text-text-dim">{assets.length} items</span>
                    </div>
                    {assets.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-white/[0.08] p-10 text-center text-sm text-text-muted">
                            No assets yet. Upload your first object above.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                            {assets.map((a) => (
                                <div
                                    key={a.id}
                                    className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.025]"
                                >
                                    <div className="aspect-square overflow-hidden bg-ink-900">
                                        {a.preview_url && (
                                            <img
                                                src={a.preview_url}
                                                alt={a.name}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between p-3 text-xs">
                                        <span className="truncate">{a.name}</span>
                                        <button
                                            onClick={async () => {
                                                await assetService.remove(a.id);
                                                setAssets((arr) => arr.filter((x) => x.id !== a.id));
                                            }}
                                            className="text-text-dim hover:text-rose-400"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
