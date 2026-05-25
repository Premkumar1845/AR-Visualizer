import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const schema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    remember: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

export default function Login() {
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loading } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FormData) => {
        try {
            await login(data.email, data.password);
            toast.success('Welcome back');
            const to = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/dashboard';
            navigate(to, { replace: true });
        } catch (err: any) {
            toast.error(err?.response?.data?.message || err?.friendlyMessage || 'Could not sign in');
        }
    };

    return (
        <div>
            <div className="mb-8">
                <div className="pill mb-5">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Welcome back
                </div>
                <h1 className="font-manrope text-3xl font-semibold tracking-tight">Sign in to your spatial workspace</h1>
                <p className="mt-2 text-sm text-text-muted">
                    Continue your AR sessions, manage assets, and reopen saved scenes.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="mb-1.5 block text-xs text-text-muted">Email</label>
                    <div className="relative">
                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
                        <input
                            type="email"
                            autoComplete="email"
                            {...register('email')}
                            className="input-field pl-10"
                            placeholder="you@studio.com"
                        />
                    </div>
                    {errors.email && <p className="mt-1.5 text-xs text-rose-400">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="mb-1.5 block text-xs text-text-muted">Password</label>
                    <div className="relative">
                        <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
                        <input
                            type={show ? 'text' : 'password'}
                            autoComplete="current-password"
                            {...register('password')}
                            className="input-field px-10"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShow((v) => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-primary"
                        >
                            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1.5 text-xs text-rose-400">{errors.password.message}</p>}
                </div>

                <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 text-text-muted">
                        <input type="checkbox" {...register('remember')} className="h-3.5 w-3.5 accent-accent" />
                        Remember me
                    </label>
                    <Link to="/forgot-password" className="text-text-muted hover:text-text-primary">
                        Forgot password?
                    </Link>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                    {loading ? 'Signing in…' : (
                        <>
                            Sign in <ArrowRight className="h-4 w-4" />
                        </>
                    )}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-text-muted">
                New to AR-Visualizer?{' '}
                <Link to="/register" className="text-text-primary underline-offset-4 hover:underline">
                    Create an account
                </Link>
            </p>
        </div>
    );
}
