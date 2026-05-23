'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { HelpCircle, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-stone-950 font-sans text-white overflow-x-hidden antialiased">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="max-w-md w-full bg-stone-900 border border-stone-850 p-10 rounded-lg shadow-2xl flex flex-col items-center gap-6">
          <div className="h-16 w-16 rounded-full bg-amber-950/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
            <HelpCircle className="h-9 w-9" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-widest text-amber-400 font-extrabold uppercase">
              Error 404
            </span>
            <h1 className="font-serif text-3xl font-bold text-white tracking-wide">
              Refraction Lost
            </h1>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm mt-1">
              The reflective path you are seeking does not exist or has been relocated to another gallery section.
            </p>
          </div>

          <div className="w-full flex flex-col gap-3 mt-4">
            <Link
              href="/"
              className="w-full bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-extrabold uppercase tracking-widest text-[10px] py-3 rounded flex items-center justify-center gap-1.5 hover:from-white hover:to-amber-200 transition-all duration-300"
            >
              <span>Return to Showroom</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/collections"
              className="w-full bg-stone-800 hover:bg-stone-750 text-stone-300 font-extrabold uppercase tracking-widest text-[10px] py-3 rounded transition-colors"
            >
              Browse Collections
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
