'use client';

import React, { useState, Suspense } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, AlertCircle, ArrowRight } from 'lucide-react';
import { Analytics } from '@/lib/analytics';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/profile';

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone || undefined,
        callbackURL: callbackUrl,
      });

      if (response.error) {
        setError(response.error.message || 'Registration failed. Email might already exist.');
      } else {
        Analytics.trackFormSubmission('REGISTER');
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during account creation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout>
      <section className="bg-stone-950 min-h-[90vh] flex items-center justify-center py-16 px-4 font-sans text-stone-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full bg-stone-900 border border-stone-850 p-8 rounded shadow-2xl flex flex-col gap-6"
        >
          {/* Header text */}
          <div className="text-center flex flex-col gap-1.5 select-none">
            <span className="text-[10px] uppercase tracking-widest text-amber-300 font-extrabold font-sans">Join the Club</span>
            <h1 className="font-serif text-3xl font-bold text-white">Client Registration</h1>
            <div className="w-12 h-0.5 bg-amber-400 mx-auto mt-1" />
            <p className="text-[11px] text-stone-500 mt-1 font-sans">
              Create an exclusive atelier account to unlock personal custom mirror portfolios and rapid checkout.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-950/20 border border-red-900 text-red-400 text-xs rounded flex items-center gap-2">
              <AlertCircle className="h-4.5 w-4.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form input items */}
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider text-stone-500 font-extrabold flex items-center gap-1">
                <User className="h-3 w-3" /> Full Name
              </label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider text-stone-500 font-extrabold flex items-center gap-1">
                <Mail className="h-3 w-3" /> Email Address
              </label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="client@luxurymail.com"
                className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider text-stone-500 font-extrabold flex items-center gap-1">
                <Phone className="h-3 w-3" /> Contact Phone (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g. +91 9876543210"
                className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider text-stone-500 font-extrabold flex items-center gap-1">
                <Lock className="h-3 w-3" /> Choose Password
              </label>
              <input
                required
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Minimum 8 characters"
                className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider text-stone-500 font-extrabold flex items-center gap-1">
                <Lock className="h-3 w-3" /> Confirm Password
              </label>
              <input
                required
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Retype password"
                className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-extrabold uppercase tracking-widest text-xs py-3.5 rounded mt-2 hover:from-white hover:to-amber-200 transition-all duration-300 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Creating Client Account...' : 'Register Account'}
            </button>
          </form>

          {/* Footer pathway */}
          <div className="text-center pt-4 border-t border-stone-850/60 flex flex-col gap-2 text-xs">
            <span className="text-stone-500">Already registered?</span>
            <Link
              href={`/login${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
              className="text-amber-300 hover:text-white font-bold uppercase tracking-wider flex items-center gap-1 justify-center animate-pulse"
            >
              <span>Login to Existing Account</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </PublicLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-stone-950 font-sans text-xs text-stone-400">
        <span>Loading Showroom Registration...</span>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}

