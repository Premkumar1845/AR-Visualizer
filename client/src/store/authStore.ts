import { create } from 'zustand';
import { authService, type AuthUser } from '../services/auth.service';

interface AuthState {
    user: AuthUser | null;
    token: string | null;
    loading: boolean;
    hydrated: boolean;
    hydrate: () => void;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    loading: false,
    hydrated: false,
    hydrate: () => {
        const token = localStorage.getItem('arv_token');
        const userStr = localStorage.getItem('arv_user');
        if (token && userStr) {
            try {
                set({ token, user: JSON.parse(userStr), hydrated: true });
                return;
            } catch {
                /* fallthrough */
            }
        }
        set({ hydrated: true });
    },
    login: async (email, password) => {
        set({ loading: true });
        try {
            const { user, token } = await authService.login(email, password);
            localStorage.setItem('arv_token', token);
            localStorage.setItem('arv_user', JSON.stringify(user));
            set({ user, token, loading: false });
        } catch (e) {
            set({ loading: false });
            throw e;
        }
    },
    register: async (name, email, password) => {
        set({ loading: true });
        try {
            const { user, token } = await authService.register(name, email, password);
            localStorage.setItem('arv_token', token);
            localStorage.setItem('arv_user', JSON.stringify(user));
            set({ user, token, loading: false });
        } catch (e) {
            set({ loading: false });
            throw e;
        }
    },
    logout: () => {
        localStorage.removeItem('arv_token');
        localStorage.removeItem('arv_user');
        set({ user: null, token: null });
    },
}));
