import { motion } from 'framer-motion';
import {
    Scan,
    Maximize2,
    Move3d,
    Sparkles,
    Camera,
    Layers,
} from 'lucide-react';

export default function HeroVisual() {
    return (
        <div className="relative mx-auto w-full max-w-[560px]">
            {/* Glow */}
            <div className="absolute -inset-10 -z-10 rounded-[3rem] bg-mesh-accent blur-3xl opacity-70" />

            {/* Device frame */}
            <motion.div
                initial={{ y: 30, opacity: 0, rotateX: 8 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformPerspective: 1200 }}
                className="relative aspect-[9/14] w-full overflow-hidden rounded-[2.4rem] border border-white/[0.1] bg-ink-900 shadow-spatial"
            >
                {/* Notch */}
                <div className="absolute left-1/2 top-3 z-30 h-5 w-24 -translate-x-1/2 rounded-full bg-black/80 ring-1 ring-white/5" />

                {/* Live "camera feed" */}
                <div className="absolute inset-0">
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                'radial-gradient(ellipse at 30% 20%, rgba(123,97,255,0.18), transparent 55%), radial-gradient(ellipse at 70% 70%, rgba(142,167,255,0.16), transparent 55%), linear-gradient(180deg, #15171C, #0a0c10)',
                        }}
                    />
                    {/* faux room "floor" */}
                    <div
                        className="absolute inset-x-[-20%] bottom-[-20%] h-1/2 origin-top"
                        style={{
                            transform: 'perspective(900px) rotateX(60deg)',
                            backgroundImage:
                                'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
                            backgroundSize: '40px 40px',
                            maskImage:
                                'radial-gradient(ellipse at 50% 0%, #000 30%, transparent 75%)',
                        }}
                    />
                    {/* surface reticle */}
                    <motion.div
                        animate={{ scale: [1, 1.06, 1], opacity: [0.65, 1, 0.65] }}
                        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute left-1/2 top-[58%] h-24 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/40"
                        style={{
                            transform: 'translate(-50%, -50%) rotateX(60deg)',
                            boxShadow:
                                '0 0 60px rgba(123,97,255,0.45), inset 0 0 30px rgba(123,97,255,0.25)',
                        }}
                    />
                    {/* Placed object — floating cube w/ shadow */}
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute left-1/2 top-[42%] -translate-x-1/2"
                    >
                        <div
                            className="h-28 w-28 rounded-2xl border border-white/15 bg-gradient-to-br from-white/15 to-white/[0.02] shadow-[0_30px_60px_-10px_rgba(123,97,255,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-xl"
                            style={{
                                transform: 'perspective(800px) rotateX(18deg) rotateY(-22deg)',
                            }}
                        />
                    </motion.div>

                    {/* Anchor labels */}
                    <div className="absolute left-6 top-[34%] flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] text-white/85 backdrop-blur-md">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Surface locked
                    </div>
                    <div className="absolute right-6 top-[44%] flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] text-white/85 backdrop-blur-md">
                        <Move3d className="h-3 w-3" /> 1.0× · 0°
                    </div>
                </div>

                {/* Top toolbar */}
                <div className="absolute inset-x-3 top-12 z-20 flex items-center justify-between rounded-2xl border border-white/[0.08] bg-black/40 px-3 py-2 backdrop-blur-xl">
                    <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                        <Camera className="h-3.5 w-3.5" /> AR · Live
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                        <Sparkles className="h-3.5 w-3.5 text-accent-soft" /> WebXR
                    </div>
                </div>

                {/* Bottom controls */}
                <div className="absolute inset-x-3 bottom-3 z-20 rounded-2xl border border-white/[0.08] bg-black/50 p-2 backdrop-blur-xl">
                    <div className="grid grid-cols-4 gap-1.5">
                        {[
                            { icon: Move3d, label: 'Move' },
                            { icon: Maximize2, label: 'Scale' },
                            { icon: Scan, label: 'Snap' },
                            { icon: Layers, label: 'Stack' },
                        ].map((it) => (
                            <div
                                key={it.label}
                                className="flex flex-col items-center gap-1 rounded-xl bg-white/[0.04] py-2 text-[9px] text-text-muted"
                            >
                                <it.icon className="h-3.5 w-3.5" />
                                {it.label}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Floating side cards */}
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -left-8 top-[18%] hidden w-44 rounded-2xl border border-white/[0.08] bg-ink-900/80 p-3 shadow-glass backdrop-blur-xl md:block"
            >
                <div className="mb-1 text-[10px] uppercase tracking-widest text-text-dim">Spatial Anchor</div>
                <div className="text-sm font-medium">Living Room · Floor</div>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Tracking 60fps
                </div>
            </motion.div>
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -right-6 top-[55%] hidden w-44 rounded-2xl border border-white/[0.08] bg-ink-900/80 p-3 shadow-glass backdrop-blur-xl md:block"
            >
                <div className="mb-1 text-[10px] uppercase tracking-widest text-text-dim">Material</div>
                <div className="text-sm font-medium">Brushed Aluminium</div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <div className="h-full w-3/4 bg-gradient-to-r from-accent to-accent-soft" />
                </div>
            </motion.div>
        </div>
    );
}
