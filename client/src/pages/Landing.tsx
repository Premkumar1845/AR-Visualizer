import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowUpRight,
    PlayCircle,
    Globe2,
    Camera,
    Move3d,
    Smartphone,
    Sparkles,
    Layers,
    Shield,
    Building2,
    ShoppingBag,
    Brush,
    GraduationCap,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import HeroVisual from '../components/HeroVisual';

const trust = [
    { icon: Globe2, label: 'WebXR Powered' },
    { icon: Camera, label: 'Camera-Based AR' },
    { icon: Move3d, label: 'Real-Time Placement' },
    { icon: Smartphone, label: 'Mobile Optimized' },
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    viewport: { once: true, margin: '-80px' },
};

export default function Landing() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-ink-950 text-text-primary">
            {/* Backgrounds */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-mesh-accent opacity-80" />
                <div className="absolute inset-0 bg-grid-soft bg-grid-soft opacity-[0.5] mask-fade-b" />
                <div className="absolute inset-x-0 top-0 h-[60vh] bg-gradient-to-b from-accent/[0.06] to-transparent" />
            </div>

            <Navbar />

            {/* ───────── HERO ───────── */}
            <section className="relative px-4 pb-24 pt-36 sm:pt-44 lg:px-8">
                <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
                    {/* Left */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="pill"
                        >
                            <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent-soft">
                                New
                            </span>
                            Say Hello to AR-Visualizer v3.2
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-6 font-manrope text-[44px] font-semibold leading-[1.05] tracking-tight sm:text-[56px] lg:text-[64px]"
                        >
                            Place Digital Objects
                            <br />
                            Into The{' '}
                            <span className="font-editorial italic text-gradient-accent">Real World</span>.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.15 }}
                            className="mt-6 max-w-xl text-[15px] leading-relaxed text-text-muted sm:text-base"
                        >
                            Upload any object, launch immersive AR, and visualize lifelike spatial assets directly
                            inside your environment using browser-based augmented reality.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.25 }}
                            className="mt-8 flex flex-wrap items-center gap-3"
                        >
                            <Link to="/register" className="btn-primary">
                                Launch AR Experience
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                            <a href="#engine" className="btn-ghost">
                                <PlayCircle className="h-4 w-4" />
                                Watch Spatial Demo
                            </a>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4"
                        >
                            {trust.map((t) => (
                                <div
                                    key={t.label}
                                    className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-[11px] text-text-muted"
                                >
                                    <t.icon className="h-3.5 w-3.5 text-accent-soft" />
                                    {t.label}
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right visual */}
                    <div className="relative">
                        <HeroVisual />
                    </div>
                </div>
            </section>

            {/* ───────── EXPERIENCE ───────── */}
            <section id="experience" className="relative px-4 py-28 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
                        <div className="pill mx-auto">Spatial Experience</div>
                        <h2 className="mt-5 font-manrope text-4xl font-semibold tracking-tight sm:text-5xl">
                            A new layer between you and{' '}
                            <span className="font-editorial italic text-gradient-accent">reality</span>.
                        </h2>
                        <p className="mt-4 text-text-muted">
                            From a single browser tab to a spatial workstation. AR-Visualizer turns any device
                            into a portal for placing, sculpting, and reviewing real-scale digital objects.
                        </p>
                    </motion.div>

                    <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {[
                            {
                                icon: Sparkles,
                                title: 'Cinematic AR Workspace',
                                desc: 'Live camera tracking with surface anchors, ambient occlusion, and spatial gizmos.',
                            },
                            {
                                icon: Layers,
                                title: 'Object Pipeline',
                                desc: 'Upload PNG · JPG · WebP. Edge detection, background removal, and mesh prep — automatic.',
                            },
                            {
                                icon: Shield,
                                title: 'Enterprise Foundations',
                                desc: 'JWT, Supabase RLS, scoped storage, and an MVC backend ready for serious workloads.',
                            },
                        ].map((c) => (
                            <motion.div
                                key={c.title}
                                {...fadeUp}
                                className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 transition-all hover:bg-white/[0.04]"
                            >
                                <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04]">
                                    <c.icon className="h-4 w-4 text-accent-soft" />
                                </div>
                                <h3 className="font-manrope text-lg font-semibold">{c.title}</h3>
                                <p className="mt-2 text-sm text-text-muted">{c.desc}</p>
                                <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-accent/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────── ENGINE ───────── */}
            <section id="engine" className="relative px-4 py-28 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <motion.div {...fadeUp} className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                        <div>
                            <div className="pill">Spatial Engine</div>
                            <h2 className="mt-5 font-manrope text-4xl font-semibold tracking-tight sm:text-5xl">
                                Render-grade spatial computing — in your browser tab.
                            </h2>
                            <p className="mt-4 max-w-lg text-text-muted">
                                Built on Three.js, React Three Fiber, and WebXR with a custom render pipeline tuned
                                for mobile silicon. No installs. No friction. Just open a URL.
                            </p>
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                {[
                                    { k: '< 80ms', v: 'Surface lock-on latency' },
                                    { k: '60 fps', v: 'Mobile WebGL target' },
                                    { k: '4K', v: 'Native texture pipeline' },
                                    { k: 'WebXR', v: 'Native browser AR' },
                                ].map((x) => (
                                    <div
                                        key={x.v}
                                        className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4"
                                    >
                                        <div className="font-manrope text-2xl font-semibold text-text-primary">
                                            {x.k}
                                        </div>
                                        <div className="mt-1 text-xs text-text-muted">{x.v}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-mesh-accent blur-3xl opacity-60" />
                            <div className="glass-strong rounded-3xl p-2 shadow-spatial">
                                <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink-900">
                                    <div className="grid h-full grid-cols-3 grid-rows-2 gap-1 p-1">
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/[0.05] to-transparent"
                                            >
                                                <div
                                                    className="absolute inset-0 opacity-60"
                                                    style={{
                                                        background:
                                                            i % 2
                                                                ? 'radial-gradient(circle at 60% 40%, rgba(123,97,255,0.45), transparent 60%)'
                                                                : 'radial-gradient(circle at 30% 70%, rgba(142,167,255,0.4), transparent 60%)',
                                                    }}
                                                />
                                                <div className="absolute bottom-2 left-2 right-2 text-[9px] uppercase tracking-widest text-white/60">
                                                    Anchor · {i + 1}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ───────── USE CASES ───────── */}
            <section id="use-cases" className="relative px-4 py-28 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
                        <div className="pill mx-auto">Use Cases</div>
                        <h2 className="mt-5 font-manrope text-4xl font-semibold tracking-tight sm:text-5xl">
                            Built for teams shipping spatial-first products.
                        </h2>
                    </motion.div>

                    <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { icon: ShoppingBag, t: 'Retail & Commerce', d: 'Try-before-you-buy product visualization at room scale.' },
                            { icon: Building2, t: 'Architecture', d: 'Place furniture, fixtures, and prototypes inside real spaces.' },
                            { icon: Brush, t: 'Creative Studios', d: 'Review sculpts, materials, and props in physical context.' },
                            { icon: GraduationCap, t: 'Education', d: 'Bring lessons, anatomy, and physics into the classroom.' },
                        ].map((u) => (
                            <motion.div
                                key={u.t}
                                {...fadeUp}
                                className="rounded-3xl border border-white/[0.06] bg-white/[0.025] p-6"
                            >
                                <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04]">
                                    <u.icon className="h-4 w-4 text-accent-soft" />
                                </div>
                                <h3 className="font-manrope text-lg font-semibold">{u.t}</h3>
                                <p className="mt-2 text-sm text-text-muted">{u.d}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────── PRICING ───────── */}
            <section id="pricing" className="relative px-4 py-28 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
                        <div className="pill mx-auto">Pricing</div>
                        <h2 className="mt-5 font-manrope text-4xl font-semibold tracking-tight sm:text-5xl">
                            Start free. Scale spatially.
                        </h2>
                    </motion.div>

                    <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {[
                            {
                                name: 'Atelier',
                                price: 'Free',
                                desc: 'For creators exploring spatial computing.',
                                features: ['Up to 25 assets', 'Browser AR', 'Mobile camera placement', 'Saved scenes'],
                            },
                            {
                                name: 'Studio',
                                price: '$24',
                                period: '/ mo',
                                featured: true,
                                desc: 'For professionals shipping spatial work.',
                                features: ['Unlimited assets', 'WebXR + Quest', 'Material library', 'Team scenes'],
                            },
                            {
                                name: 'Enterprise',
                                price: 'Custom',
                                desc: 'For organizations deploying at scale.',
                                features: ['SSO + SCIM', 'Private regions', 'Dedicated infra', 'Premium support'],
                            },
                        ].map((p) => (
                            <motion.div
                                key={p.name}
                                {...fadeUp}
                                className={`relative rounded-3xl border p-6 ${p.featured
                                    ? 'border-accent/40 bg-gradient-to-b from-accent/[0.08] to-white/[0.02] shadow-glow'
                                    : 'border-white/[0.06] bg-white/[0.025]'
                                    }`}
                            >
                                {p.featured && (
                                    <span className="absolute right-5 top-5 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] tracking-widest text-accent-soft">
                                        POPULAR
                                    </span>
                                )}
                                <div className="font-manrope text-lg font-semibold">{p.name}</div>
                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="font-manrope text-4xl font-semibold">{p.price}</span>
                                    {p.period && <span className="text-text-muted">{p.period}</span>}
                                </div>
                                <p className="mt-2 text-sm text-text-muted">{p.desc}</p>
                                <ul className="mt-6 space-y-2 text-sm text-text-muted">
                                    {p.features.map((f) => (
                                        <li key={f} className="flex items-center gap-2">
                                            <span className="h-1 w-1 rounded-full bg-accent-soft" /> {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    to="/register"
                                    className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium ${p.featured ? 'btn-primary' : 'btn-ghost'
                                        }`}
                                >
                                    Get started
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────── CTA ───────── */}
            <section className="relative px-4 pb-28 lg:px-8">
                <motion.div
                    {...fadeUp}
                    className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-ink-800 to-ink-900 p-10 text-center shadow-spatial sm:p-16"
                >
                    <div className="absolute inset-0 -z-10 bg-mesh-accent opacity-60" />
                    <div className="pill mx-auto">Ready when you are</div>
                    <h3 className="mt-5 font-manrope text-3xl font-semibold tracking-tight sm:text-5xl">
                        Open a browser. Step into the{' '}
                        <span className="font-editorial italic text-gradient-accent">future</span>.
                    </h3>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Link to="/register" className="btn-primary">
                            Launch AR Experience <ArrowUpRight className="h-4 w-4" />
                        </Link>
                        <Link to="/login" className="btn-ghost">
                            I already have an account
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/[0.05] px-4 py-10 lg:px-8">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-xs text-text-dim sm:flex-row">
                    <div>© {new Date().getFullYear()} AR-Visualizer — Spatial Computing for the Web.</div>
                    <div className="flex gap-5">
                        <a href="#" className="hover:text-text-primary">Privacy</a>
                        <a href="#" className="hover:text-text-primary">Terms</a>
                        <a href="#" className="hover:text-text-primary">Security</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
