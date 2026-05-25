import { api } from './api';

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    avatar_url?: string | null;
}

export const authService = {
    async login(email: string, password: string) {
        const { data } = await api.post('/auth/login', { email, password });
        return data as { user: AuthUser; token: string };
    },
    async register(name: string, email: string, password: string) {
        const { data } = await api.post('/auth/register', { name, email, password });
        return data as { user: AuthUser; token: string };
    },
    async forgotPassword(email: string) {
        const { data } = await api.post('/auth/forgot-password', { email });
        return data as { ok: true };
    },
    async me() {
        const { data } = await api.get('/auth/me');
        return data as { user: AuthUser };
    },
};
