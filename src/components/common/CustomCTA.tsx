'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';

const FEATURES = [
  'Choose Organic or Geometric Shapes',
  'Define Custom Width & Height Sizing',
  'Select Dimmable LED Backlighting Temp',
  'Choose Premium Champagne Frame Finishes',
];

export default function CustomCTA() {
  return (
    <section className="relative bg-stone-950 py-24 border-t border-stone-900 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="bg-stone-900/40 border border-stone-900 rounded-lg p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 max-w-6xl mx-auto shadow-2xl shadow-black/40">
          
          {/* Left Text Column */}
          <div className="flex flex-col gap-6 text-left max-w-xl">
            <div className="flex items-center gap-2 text-amber-300">
              <Sparkles className="h-4 w-4 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                Bespoke Atelier Requisition
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Design Your Own Mirror
            </h2>
            
            <p className="text-stone-400 text-sm sm:text-base font-sans leading-relaxed">
              Cannot find the exact style or dimension? Our custom ateliers can handcraft any mirror to your exact visual blueprint. Pick your details and request a designer quote.
            </p>

            {/* Configurator Spec List */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-stone-300 text-xs sm:text-sm font-sans font-medium leading-tight">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Action buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-4 w-full sm:w-auto shrink-0 lg:min-w-64">
            <Link
              href="/custom-mirrors"
              className="w-full sm:w-auto bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-500 hover:from-white hover:to-amber-200 text-stone-950 font-extrabold text-center uppercase tracking-widest text-xs px-8 py-4.5 rounded shadow-xl shadow-amber-500/10 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              Customize Now
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto border border-stone-800 hover:border-amber-400/40 text-stone-300 hover:text-amber-200 font-extrabold text-center uppercase tracking-widest text-xs px-8 py-4.5 rounded bg-stone-950/60 hover:bg-stone-900 transition-all duration-300"
            >
              Contact Atelier
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
