import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, hydrated } = useAuthStore();
    const location = useLocation();

    if (!hydrated) {
        return (
            <div className="grid h-screen place-items-center bg-ink-950">
                <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
    return <>{children}</>;
}
