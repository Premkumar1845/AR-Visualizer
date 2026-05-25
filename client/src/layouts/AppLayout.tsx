import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    UploadCloud,
    Sparkles,
    FolderHeart,
    LogOut,
    Settings,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Logo3D from '../components/Logo3D';

const nav = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/upload', label: 'Upload Studio', icon: UploadCloud },
    { to: '/ar', label: 'AR Workspace', icon: Sparkles },
    { to: '/library', label: 'Library', icon: FolderHeart },
];

export default function AppLayout() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen bg-ink-950 text-text-primary">
            {/* ambient backgrounds */}
            <div className="pointer-events-none fixed inset-0 -z-10 bg-mesh-accent opacity-50" />
            <div className="pointer-events-none fixed inset-0 -z-10 bg-grid-soft bg-grid-soft opacity-[0.4] mask-fade-b" />

            <div className="mx-auto grid min-h-screen w-full grid-cols-1 lg:grid-cols-[260px_1fr]">
                {/* Sidebar */}
                <aside className="hidden border-r border-white/[0.06] lg:flex lg:flex-col">
                    <div className="flex items-center gap-3 px-6 py-6">
                        <div className="h-9 w-9 overflow-hidden rounded-lg">
                            <Logo3D compact />
                        </div>
                        <div>
                            <div className="font-manrope text-sm font-semibold tracking-tight">AR-Visualizer</div>
                            <div className="text-[10px] uppercase tracking-[0.2em] text-text-dim">v3.2 Spatial</div>
                        </div>
                    </div>

                    <nav className="flex flex-1 flex-col gap-1 px-3">
                        {nav.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${isActive
                                        ? 'bg-white/[0.06] text-text-primary'
                                        : 'text-text-muted hover:bg-white/[0.03] hover:text-text-primary'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <motion.span
                                                layoutId="nav-pill"
                                                className="absolute inset-0 -z-10 rounded-xl border border-white/10 bg-white/[0.04]"
                                                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                                            />
                                        )}
                                        <item.icon className="h-4 w-4" />
                                        <span className="font-medium">{item.label}</span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="m-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-soft text-xs font-semibold">
                                {user?.name?.[0]?.toUpperCase() ?? 'U'}
                            </div>
                            <div className="min-w-0">
                                <div className="truncate text-sm font-medium">{user?.name}</div>
                                <div className="truncate text-xs text-text-dim">{user?.email}</div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-text-muted hover:bg-white/[0.04]"
                                onClick={() => navigate('/dashboard')}
                            >
                                <Settings className="h-3.5 w-3.5" /> Settings
                            </button>
                            <button
                                onClick={() => {
                                    logout();
                                    navigate('/');
                                }}
                                className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-text-muted hover:bg-white/[0.04]"
                            >
                                <LogOut className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Mobile top bar */}
                <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.06] bg-ink-950/80 px-4 py-3 backdrop-blur-xl lg:hidden">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 overflow-hidden rounded-md">
                            <Logo3D compact />
                        </div>
                        <span className="font-manrope text-sm font-semibold">AR-Visualizer</span>
                    </div>
                    <button
                        onClick={() => {
                            logout();
                            navigate('/');
                        }}
                        className="text-xs text-text-muted"
                    >
                        Sign out
                    </button>
                </header>

                {/* Main */}
                <main className="relative min-w-0">
                    <Outlet />

                    {/* Mobile bottom nav */}
                    <nav className="sticky bottom-0 z-30 flex items-center justify-around border-t border-white/[0.06] bg-ink-900/80 px-2 py-2 backdrop-blur-xl lg:hidden">
                        {nav.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] ${isActive ? 'text-text-primary' : 'text-text-dim'
                                    }`
                                }
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label.split(' ')[0]}
                            </NavLink>
                        ))}
                    </nav>
                </main>
            </div>
        </div>
    );
}
