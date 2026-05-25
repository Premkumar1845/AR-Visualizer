import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: false,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('arv_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (r) => r,
    (err) => {
        if (err?.response?.status === 401) {
            localStorage.removeItem('arv_token');
            localStorage.removeItem('arv_user');
        }
        // Normalize network / CORS errors into a friendlier message so UIs
        // don't surface raw "TypeError: fetch failed" / "Network Error".
        if (!err?.response) {
            err.friendlyMessage =
                'Cannot reach the AR-Visualizer API. Make sure the backend is running on ' +
                (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') +
                '.';
        }
        return Promise.reject(err);
    },
);
