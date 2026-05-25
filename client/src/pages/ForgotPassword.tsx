import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';
import { useState } from 'react';

const schema = z.object({ email: z.string().email('Enter a valid email') });
type FormData = z.infer<typeof schema>;

export default function ForgotPassword() {
    const [sent, setSent] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (d: FormData) => {
        try {
            await authService.forgotPassword(d.email);
            setSent(true);
            toast.success('Reset link sent if that email exists');
        } catch (err: any) {
            toast.error(err?.response?.data?.message || err?.friendlyMessage || 'Could not send reset email');
        }
    };

    return (
        <div>
            <div className="mb-8">
                <div className="pill mb-5">Account recovery</div>
                <h1 className="font-manrope text-3xl font-semibold tracking-tight">
                    Reset your password
                </h1>
                <p className="mt-2 text-sm text-text-muted">
                    We'll email you a secure spatial recovery link.
                </p>
            </div>

            {sent ? (
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-sm text-text-muted">
                    If an account exists for that email, a reset link is on its way.
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-xs text-text-muted">Email</label>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
                            <input
                                type="email"
                                {...register('email')}
                                className="input-field pl-10"
                                placeholder="you@studio.com"
                            />
                        </div>
                        {errors.email && <p className="mt-1.5 text-xs text-rose-400">{errors.email.message}</p>}
                    </div>

                    <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center">
                        Send reset link <ArrowRight className="h-4 w-4" />
                    </button>
                </form>
            )}

            <p className="mt-6 text-center text-sm text-text-muted">
                Remembered it?{' '}
                <Link to="/login" className="text-text-primary underline-offset-4 hover:underline">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
