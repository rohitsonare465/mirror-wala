'use client';

import React, { useState, Suspense } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { Analytics } from '@/lib/analytics';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/profile';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authClient.signIn.email({
        email,
        password,
        callbackURL: callbackUrl,
      });

      if (response.error) {
        setError(response.error.message || 'Invalid email or password credentials.');
      } else {
        Analytics.trackFormSubmission('LOGIN');
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
    <PublicLayout>
      <section className="bg-stone-950 min-h-[85vh] flex items-center justify-center py-16 px-4 font-sans text-stone-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full bg-stone-900 border border-stone-850 p-8 rounded shadow-2xl flex flex-col gap-6"
        >
          {/* Header branding info */}
          <div className="text-center flex flex-col gap-1.5 select-none">
            <span className="text-[10px] uppercase tracking-widest text-amber-300 font-extrabold">Welcome Back</span>
            <h1 className="font-serif text-3xl font-bold text-white">Showroom Entry</h1>
            <div className="w-12 h-0.5 bg-amber-400 mx-auto mt-1" />
            <p className="text-[11px] text-stone-500 mt-1 font-sans">
              Enter your luxury client credentials to unlock saved designs, quotations and orders.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-950/20 border border-red-900 text-red-400 text-xs rounded flex items-center gap-2">
              <AlertCircle className="h-4.5 w-4.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form items */}
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider text-stone-500 font-extrabold flex items-center gap-1">
                <Mail className="h-3 w-3" /> Email Address
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@luxurymail.com"
                className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-wider text-stone-500 font-extrabold flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Secure Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] text-amber-300 hover:text-white transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-extrabold uppercase tracking-widest text-xs py-3.5 rounded mt-2 hover:from-white hover:to-amber-200 transition-all duration-300 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Verifying Client...' : 'Authorize Login'}
            </button>
          </form>

          {/* Footer pathways */}
          <div className="text-center pt-4 border-t border-stone-850/60 flex flex-col gap-2 text-xs">
            <span className="text-stone-500">New to Mirrorwala?</span>
            <Link
              href={`/register${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
              className="text-amber-300 hover:text-white font-bold uppercase tracking-wider flex items-center gap-1 justify-center"
            >
              <span>Register New Client Account</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </PublicLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-stone-950 font-sans text-xs text-stone-400">
        <span>Loading Showroom Login...</span>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

