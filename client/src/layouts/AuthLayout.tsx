import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo3D from '../components/Logo3D';

export default function AuthLayout() {
    return (
        <div className="relative grid min-h-screen grid-cols-1 bg-ink-950 lg:grid-cols-2">
            {/* Left — cinematic 3D */}
            <div className="relative hidden overflow-hidden border-r border-white/[0.06] bg-ink-900 lg:block">
                <div className="absolute inset-0 bg-mesh-accent opacity-60" />
                <div className="absolute inset-0 bg-grid-soft bg-grid-soft opacity-20" />

                <div className="absolute left-8 top-8 flex items-center gap-3">
                    <div className="h-9 w-9 overflow-hidden rounded-lg">
                        <Logo3D compact />
                    </div>
                    <Link to="/" className="font-manrope text-sm font-semibold tracking-tight">
                        AR-Visualizer
                    </Link>
                </div>

                <div className="relative h-full w-full">
                    <Logo3D />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute bottom-12 left-12 right-12 z-10 max-w-md"
                >
                    <div className="pill mb-4">
                        <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-accent" />
                        Spatial Computing Engine
                    </div>
                    <h2 className="font-editorial text-4xl leading-tight">
                        Step into the next layer of <em className="text-gradient-accent not-italic">reality</em>.
                    </h2>
                    <p className="mt-3 max-w-sm text-sm text-text-muted">
                        A browser-native augmented reality platform built for creators, retailers, designers, and
                        spatial product teams.
                    </p>
                </motion.div>
            </div>

            {/* Right — form */}
            <div className="relative flex items-center justify-center px-6 py-12">
                <Link
                    to="/"
                    className="absolute left-6 top-6 flex items-center gap-2 text-xs text-text-muted hover:text-text-primary lg:hidden"
                >
                    ← Back
                </Link>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-md"
                >
                    <Outlet />
                </motion.div>
            </div>
        </div>
    );
}
