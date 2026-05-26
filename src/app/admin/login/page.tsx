'use client';

import React, { useState, Suspense } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL: callbackUrl,
      });

      if (response.error) {
        setError(response.error.message || 'Invalid administrator credentials.');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-stone-950 min-h-screen flex items-center justify-center py-16 px-4 font-sans text-stone-300 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.03),transparent_60%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-md w-full bg-stone-900/90 backdrop-blur-md border border-stone-800/80 p-10 rounded-lg shadow-2xl flex flex-col gap-6 relative z-10 hover:border-amber-500/20 transition-colors duration-500"
      >
        {/* Header branding info */}
        <div className="text-center flex flex-col gap-2 select-none">
          <div className="mx-auto h-12 w-12 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300 mb-2">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-amber-300 font-extrabold">Security Portal</span>
          <h1 className="font-serif text-3xl font-bold text-white tracking-wide">Atelier Admin Gate</h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-600 mx-auto mt-1" />
          <p className="text-[11px] text-stone-400 leading-relaxed mt-2 max-w-xs mx-auto">
            Authorize credentials to gain secure administrative access to Mirrorwala catalog, orders and configuration panels.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-red-950/20 border border-red-900/40 text-red-400 text-xs rounded flex items-start gap-2.5"
          >
            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Form items */}
        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[9px] uppercase tracking-widest text-stone-400 font-extrabold flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-stone-500" /> Admin Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mirrorwala.com"
              className="bg-stone-950 border border-stone-850 rounded p-3.5 text-xs text-stone-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 outline-none transition-all duration-300 font-mono"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-[9px] uppercase tracking-widest text-stone-400 font-extrabold flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-stone-500" /> Secure Token
              </label>
            </div>
            <div className="relative">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-stone-950 border border-stone-850 rounded p-3.5 pr-10 text-xs text-stone-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 outline-none transition-all duration-300 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 p-0.5 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 text-stone-950 font-black uppercase tracking-widest text-[10px] py-4 rounded mt-4 hover:from-white hover:to-amber-200 transition-all duration-500 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/5 hover:shadow-amber-500/10"
          >
            {isLoading ? 'Decrypting Credentials...' : 'Authorize Entry'}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* Footer pathway */}
        <div className="text-center pt-4 border-t border-stone-800/40 flex flex-col gap-2 text-xs">
          <span className="text-stone-500">Authorized personnel only. All access is logged.</span>
        </div>
      </motion.div>
    </section>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-stone-950 font-sans text-xs text-stone-400">
        <span>Establishing Secure Gate...</span>
      </div>
    }>
      <AdminLoginContent />
    </Suspense>
  );
}
