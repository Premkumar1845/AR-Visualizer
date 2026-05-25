import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const schema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Use at least 8 characters'),
  accept: z.literal(true, { errorMap: () => ({ message: 'Please accept the terms' }) }),
});
type FormData = z.infer<typeof schema>;

export default function Register() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser, loading } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (d: FormData) => {
    try {
      await registerUser(d.name, d.email, d.password);
      toast.success('Account created');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.friendlyMessage || 'Could not create account');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="pill mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" /> New account
        </div>
        <h1 className="font-manrope text-3xl font-semibold tracking-tight">
          Create your spatial workspace
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Start placing objects in the real world from any browser.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs text-text-muted">Full name</label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
            <input {...register('name')} className="input-field pl-10" placeholder="Ada Lovelace" />
          </div>
          {errors.name && <p className="mt-1.5 text-xs text-rose-400">{errors.name.message}</p>}
        </div>
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
        <div>
          <label className="mb-1.5 block text-xs text-text-muted">Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
            <input
              type={show ? 'text' : 'password'}
              {...register('password')}
              className="input-field px-10"
              placeholder="At least 8 characters"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-primary"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-rose-400">{errors.password.message}</p>
          )}
        </div>

        <label className="flex items-start gap-2 text-xs text-text-muted">
          <input type="checkbox" {...register('accept')} className="mt-0.5 h-3.5 w-3.5 accent-accent" />
          I agree to the AR-Visualizer Terms of Service and Privacy Policy.
        </label>
        {errors.accept && <p className="text-xs text-rose-400">{errors.accept.message as string}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? 'Creating account…' : (
            <>
              Create account <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Already registered?{' '}
        <Link to="/login" className="text-text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
