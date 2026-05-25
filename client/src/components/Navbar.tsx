import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo3D from './Logo3D';

const links = [
    { href: '#experience', label: 'Experience' },
    { href: '#engine', label: 'Spatial Engine' },
    { href: '#use-cases', label: 'Use Cases' },
    { href: '#pricing', label: 'Pricing' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
        >
            <div
                className={`flex w-full max-w-7xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 ${scrolled
                    ? 'border border-white/[0.08] bg-ink-900/70 shadow-glass backdrop-blur-2xl'
                    : 'border border-transparent bg-transparent'
                    }`}
            >
                <Link to="/" className="flex items-center gap-2.5">
                    <div className="h-8 w-8 overflow-hidden rounded-lg">
                        <Logo3D compact />
                    </div>
                    <span className="font-manrope text-[15px] font-semibold tracking-tight">
                        AR-Visualizer
                    </span>
                    <span className="hidden rounded-full border border-white/[0.08] px-1.5 py-px text-[9px] tracking-widest text-text-dim sm:inline-block">
                        v3.2
                    </span>
                </Link>

                <nav className="hidden items-center gap-1 lg:flex">
                    {links.map((l) => (
                        <a
                            key={l.href}
                            href={l.href}
                            className="rounded-full px-3 py-1.5 text-[13px] text-text-muted transition-colors hover:bg-white/[0.04] hover:text-text-primary"
                        >
                            {l.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <Link
                        to="/login"
                        className="hidden rounded-full px-4 py-2 text-[13px] text-text-muted transition-colors hover:text-text-primary sm:inline-flex"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/register"
                        className="group relative hidden items-center gap-1.5 rounded-full bg-white/[0.06] px-4 py-2 text-[13px] font-medium text-text-primary ring-1 ring-white/10 transition hover:bg-white/[0.1] sm:inline-flex"
                    >
                        <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-accent" />
                        Launch AR
                    </Link>
                    <button
                        className="grid h-9 w-9 place-items-center rounded-full border border-white/[0.08] text-text-muted lg:hidden"
                        onClick={() => setOpen((v) => !v)}
                    >
                        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {open && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-20 mx-4 w-[calc(100%-2rem)] rounded-2xl border border-white/[0.08] bg-ink-900/90 p-4 backdrop-blur-2xl lg:hidden"
                >
                    <div className="flex flex-col gap-1">
                        {links.map((l) => (
                            <a
                                key={l.href}
                                href={l.href}
                                onClick={() => setOpen(false)}
                                className="rounded-xl px-3 py-2 text-sm text-text-muted hover:bg-white/[0.04]"
                            >
                                {l.label}
                            </a>
                        ))}
                        <div className="mt-2 flex gap-2 border-t border-white/[0.06] pt-3">
                            <Link to="/login" className="btn-ghost flex-1 justify-center text-xs">
                                Sign In
                            </Link>
                            <Link to="/register" className="btn-primary flex-1 justify-center text-xs">
                                Launch AR
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.header>
    );
}
