import React from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import CloudinaryImage from '@/components/common/CloudinaryImage';
import { Sparkles, Heart, ShieldAlert, BadgeCheck } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <PublicLayout>
      {/* Intro Header */}
      <section className="relative py-24 bg-gradient-to-b from-stone-900 to-stone-950 border-b border-stone-900 text-center">
        <div className="container mx-auto px-4 md:px-8 flex flex-col items-center gap-4">
          <span className="text-xs uppercase tracking-widest text-amber-300 font-bold flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Our Heritage
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Reflecting Fine Artistry
          </h1>
          <div className="w-20 h-0.5 bg-gradient-to-r from-amber-200 to-yellow-500 rounded my-1" />
          <p className="text-stone-400 max-w-xl text-xs leading-relaxed font-sans">
            Crafting luxury mirror specimens that fuse traditional hand-gilded frameworks with dynamic 21st-century smart illumination.
          </p>
        </div>
      </section>

      {/* Editorial Content */}
      <section className="bg-stone-950 py-16 text-stone-300 font-sans">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl flex flex-col gap-16">
          
          {/* Section 1: The Indore Atelier */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">Our Indore Atelier</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                Where Glass Becomes Sculpture
              </h2>
              <p className="text-xs text-stone-400 leading-relaxed font-sans">
                Located near the industrial hub of <strong>Dewas Naka, Indore</strong>, our local showroom and manufacturing studio houses master artisans who spend days hand-gilding classical frames and sculpting organic asymmetric glass forms. 
              </p>
              <p className="text-xs text-stone-400 leading-relaxed font-sans">
                Mirrorwala was founded with a singular purpose: to rescue residential walls from generic reflections. We believe a premium mirror is not just a utility, but the crucial visual anchor of a well-designed luxury home.
              </p>
            </div>
            
            <div className="relative h-96 w-full rounded border border-stone-850 overflow-hidden shadow-2xl">
              <CloudinaryImage src="/images/designer_category.png" alt="Mirrorwala Indore Atelier" fill className="object-cover" />
            </div>
          </div>

          {/* Section 2: Partnerships and Trust */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 w-full rounded border border-stone-850 overflow-hidden shadow-2xl order-last md:order-first">
              <CloudinaryImage src="/images/lightbulb_led.jpg" alt="High-CRI LED smart backlight" fill className="object-cover" />
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">Saint-Gobain Partnership</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                Premium Glass & Smart Backlighting
              </h2>
              <p className="text-xs text-stone-400 leading-relaxed font-sans">
                Every Mirrorwala artifact utilizes certified <strong>Saint-Gobain Diamond-cut crystal backing glass</strong>. Standard bathroom mirrors suffer from quick silver tarnishing and black spots; our special lead-free double-coated backings resist moisture oxidation for decades.
              </p>
              
              <div className="flex flex-col gap-3 mt-2">
                <div className="flex items-start gap-2 text-xs">
                  <BadgeCheck className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <strong className="text-white">CRI &gt; 90 Color Rendering</strong>
                    <span className="text-[10px] text-stone-500">True ambient tones for beautiful makeup vanity counters.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-xs">
                  <Heart className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <strong className="text-white">3-Year Shield Guarantee</strong>
                    <span className="text-[10px] text-stone-500">Full replacement warranty protecting smart touch sensors, defogging units, and LED backlighting strips.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="p-8 rounded border border-amber-500/10 bg-gradient-to-r from-amber-500/5 to-yellow-500/5 text-center flex flex-col items-center gap-4 mt-8">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">Experience Bespoke Luxury</h3>
            <p className="text-xs text-stone-400 max-w-xl font-sans leading-relaxed">
              Explore our catalogs or connect with our design team at the Indore showroom to sketch a tailored configuration shaped to your interior goals.
            </p>
            <div className="flex gap-4">
              <Link
                href="/custom-mirrors"
                className="bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-bold text-xs uppercase tracking-widest px-6 py-3 rounded hover:from-white hover:to-amber-200 transition-all duration-300"
              >
                Configure Custom Mirror
              </Link>
              <Link
                href="/contact"
                className="bg-stone-900 border border-stone-850 hover:bg-stone-850 text-stone-300 font-bold text-xs uppercase tracking-widest px-6 py-3 rounded transition-colors"
              >
                Contact Atelier
              </Link>
            </div>
          </div>

        </div>
      </section>
    </PublicLayout>
  );
}
