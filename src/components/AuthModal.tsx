import React, { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, Loader2, Waves, ArrowLeft, ShieldCheck } from 'lucide-react';
import { appUrl } from '../lib/appUrl';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import { cn } from '../lib/utils';

type AuthView = 'signin' | 'signup' | 'otp' | 'forgot';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    defaultView?: AuthView;
}

export default function AuthModal({ isOpen, onClose, onSuccess, defaultView = 'signin' }: AuthModalProps) {
    const [view, setView] = useState<AuthView>(defaultView);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [showResend, setShowResend] = useState(false);

    if (!isOpen) return null;

    const clearState = () => {
        setError('');
        setMessage('');
        setShowResend(false);
    };

    const requireSupabase = (): boolean => {
        if (!isSupabaseConfigured) {
            setError(
                'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env, then restart npm run dev.'
            );
            return false;
        }
        return true;
    };

    const handleResendConfirmation = async () => {
        if (!requireSupabase()) return;
        setLoading(true);
        const { error } = await getSupabase().auth.resend({ type: 'signup', email });
        setLoading(false);
        if (error) { setError(error.message); return; }
        setMessage('Confirmation email resent — check your inbox.');
        setShowResend(false);
    };


    // ── Google OAuth ──────────────────────────────────────────────────────────
    const handleGoogleSignIn = async () => {
        if (!requireSupabase()) return;
        clearState();
        setGoogleLoading(true);
        const { error } = await getSupabase().auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: appUrl('/auth/callback'),
                queryParams: { access_type: 'offline', prompt: 'consent' },
            },
        });
        if (error) { setError(error.message); setGoogleLoading(false); }
    };

    // ── Email Sign In ─────────────────────────────────────────────────────────
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!requireSupabase()) return;
        clearState();
        setLoading(true);
        const { error } = await getSupabase().auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) {
            // Supabase returns "Invalid login credentials" for both wrong password
            // AND unconfirmed email — give the user a clearer message.
            if (
                error.message.toLowerCase().includes('invalid login credentials') ||
                error.message.toLowerCase().includes('invalid credentials')
            ) {
                setError(
                    'Incorrect email or password. If you just signed up, check your inbox for a confirmation email first.'
                );
                setShowResend(true);
            } else if (error.message.toLowerCase().includes('email not confirmed')) {
                setError('Please confirm your email before signing in. Check your inbox for the confirmation link.');
                setShowResend(true);
            } else {
                setError(error.message);
            }
            return;
        }
        onSuccess();
    };

    // ── Email Sign Up ─────────────────────────────────────────────────────────
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!requireSupabase()) return;
        clearState();
        if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
        setLoading(true);
        const { error } = await getSupabase().auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName }, emailRedirectTo: appUrl('/auth/callback') },
        });
        setLoading(false);
        if (error) { setError(error.message); return; }
        setMessage('Check your email for a confirmation link.');
    };

    // ── OTP (Magic Link / Phone) ──────────────────────────────────────────────
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!requireSupabase()) return;
        clearState();
        setLoading(true);
        const { error } = await getSupabase().auth.signInWithOtp({
            email,
            options: { emailRedirectTo: appUrl('/auth/callback') },
        });
        setLoading(false);
        if (error) { setError(error.message); return; }
        setView('otp');
        setMessage('A 6-digit code was sent to ' + email);
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!requireSupabase()) return;
        clearState();
        const token = otp.join('');
        if (token.length < 6) { setError('Enter the full 6-digit code.'); return; }
        setLoading(true);
        const { error } = await getSupabase().auth.verifyOtp({ email, token, type: 'email' });
        setLoading(false);
        if (error) { setError(error.message); return; }
        onSuccess();
    };

    const handleOtpInput = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const next = [...otp];
        next[index] = value.slice(-1);
        setOtp(next);
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    // ── Forgot Password ───────────────────────────────────────────────────────
    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!requireSupabase()) return;
        clearState();
        setLoading(true);
        const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
            redirectTo: appUrl('/reset-password'),
        });
        setLoading(false);
        if (error) { setError(error.message); return; }
        setMessage('Password reset link sent to ' + email);
    };


    // ── Shared UI pieces ──────────────────────────────────────────────────────
    const inputClass = "w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all";

    const GoogleButton = () => (
        <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-slate-700 hover:border-slate-500 text-white font-semibold rounded-xl py-3 text-sm transition-all active:scale-95 disabled:opacity-60"
        >
            {googleLoading ? (
                <Loader2 size={18} className="animate-spin" />
            ) : (
                <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
            )}
            Continue with Google
        </button>
    );

    const Divider = () => (
        <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs text-slate-600 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-800" />
        </div>
    );


    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-[#0a0f1e] border border-slate-800 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                {/* Top gradient bar */}
                <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            {(view === 'otp' || view === 'forgot') && (
                                <button
                                    onClick={() => { setView('signin'); clearState(); }}
                                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                            )}
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                                    <Waves className="text-white w-4 h-4" />
                                </div>
                                <span className="text-lg font-bold text-white">
                                    AIWave<span className="text-cyan-400">Agency</span>
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Feedback messages */}
                    {error && (
                        <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm space-y-2">
                            <p>{error}</p>
                            {showResend && email && (
                                <button
                                    type="button"
                                    onClick={handleResendConfirmation}
                                    disabled={loading}
                                    className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
                                >
                                    {loading ? 'Sending…' : 'Resend confirmation email →'}
                                </button>
                            )}
                        </div>
                    )}
                    {message && (
                        <div className="mb-5 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">
                            {message}
                        </div>
                    )}


                    {/* ── SIGN IN VIEW ── */}
                    {view === 'signin' && (
                        <>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
                                <p className="text-slate-400 text-sm">Sign in to your AIWave dashboard.</p>
                            </div>

                            <GoogleButton />
                            <Divider />

                            <form onSubmit={handleSignIn} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="you@company.com"
                                            className={cn(inputClass, 'pl-10')}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                                        <button type="button" onClick={() => { setView('forgot'); clearState(); }} className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className={cn(inputClass, 'pl-10 pr-10')}
                                        />
                                        <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" disabled={loading} className="w-full btn-primary py-3 flex items-center justify-center gap-2 mt-2">
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
                                </button>
                            </form>

                            <div className="mt-5 text-center">
                                <button onClick={() => { setView('otp'); clearState(); }} className="text-xs text-slate-400 hover:text-cyan-400 transition-colors">
                                    Sign in with a one-time code instead
                                </button>
                            </div>

                            <p className="mt-6 text-center text-sm text-slate-500">
                                No account?{' '}
                                <button onClick={() => { setView('signup'); clearState(); }} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                                    Create one free
                                </button>
                            </p>
                        </>
                    )}


                    {/* ── SIGN UP VIEW ── */}
                    {view === 'signup' && (
                        <>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white mb-1">Create your account</h2>
                                <p className="text-slate-400 text-sm">Start automating your business with AIWave.</p>
                            </div>

                            <GoogleButton />
                            <Divider />

                            <form onSubmit={handleSignUp} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={e => setFullName(e.target.value)}
                                        placeholder="John Smith"
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="you@company.com"
                                            className={cn(inputClass, 'pl-10')}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder="Min. 8 characters"
                                            className={cn(inputClass, 'pl-10 pr-10')}
                                        />
                                        <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" disabled={loading} className="w-full btn-primary py-3 flex items-center justify-center gap-2 mt-2">
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account'}
                                </button>
                            </form>

                            <p className="mt-6 text-center text-sm text-slate-500">
                                Already have an account?{' '}
                                <button onClick={() => { setView('signin'); clearState(); }} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                                    Sign in
                                </button>
                            </p>
                        </>
                    )}


                    {/* ── OTP VIEW ── */}
                    {view === 'otp' && (
                        <>
                            <div className="mb-6">
                                <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mb-4">
                                    <ShieldCheck size={24} className="text-cyan-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-1">
                                    {otp.join('').length === 0 ? 'Sign in with code' : 'Enter your code'}
                                </h2>
                                <p className="text-slate-400 text-sm">
                                    {message || 'We\'ll send a 6-digit code to your email.'}
                                </p>
                            </div>

                            {/* Step 1: enter email to request OTP */}
                            {!message && (
                                <form onSubmit={handleSendOtp} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                placeholder="you@company.com"
                                                className={cn(inputClass, 'pl-10')}
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" disabled={loading} className="w-full btn-primary py-3 flex items-center justify-center gap-2">
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Send Code'}
                                    </button>
                                </form>
                            )}

                            {/* Step 2: enter the 6-digit OTP */}
                            {message && (
                                <form onSubmit={handleVerifyOtp} className="space-y-6">
                                    <div className="flex gap-2 justify-center">
                                        {otp.map((digit, i) => (
                                            <input
                                                key={i}
                                                id={`otp-${i}`}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={e => handleOtpInput(i, e.target.value)}
                                                onKeyDown={e => handleOtpKeyDown(i, e)}
                                                className="w-12 h-14 text-center text-xl font-bold bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                                            />
                                        ))}
                                    </div>
                                    <button type="submit" disabled={loading} className="w-full btn-primary py-3 flex items-center justify-center gap-2">
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Verify & Sign In'}
                                    </button>
                                    <p className="text-center text-xs text-slate-500">
                                        Didn't receive it?{' '}
                                        <button type="button" onClick={handleSendOtp} className="text-cyan-400 hover:text-cyan-300 transition-colors">
                                            Resend code
                                        </button>
                                    </p>
                                </form>
                            )}

                            <p className="mt-6 text-center text-sm text-slate-500">
                                <button onClick={() => { setView('signin'); clearState(); setMessage(''); }} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                                    Back to sign in
                                </button>
                            </p>
                        </>
                    )}


                    {/* ── FORGOT PASSWORD VIEW ── */}
                    {view === 'forgot' && (
                        <>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white mb-1">Reset password</h2>
                                <p className="text-slate-400 text-sm">Enter your email and we'll send a reset link.</p>
                            </div>

                            <form onSubmit={handleForgotPassword} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="you@company.com"
                                            className={cn(inputClass, 'pl-10')}
                                        />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full btn-primary py-3 flex items-center justify-center gap-2">
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : 'Send Reset Link'}
                                </button>
                            </form>

                            <p className="mt-6 text-center text-sm text-slate-500">
                                Remembered it?{' '}
                                <button onClick={() => { setView('signin'); clearState(); }} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                                    Sign in
                                </button>
                            </p>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}
