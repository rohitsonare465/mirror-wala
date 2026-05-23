'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Award, Layers, Sparkles, MapPin } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-stone-950 text-white min-h-[calc(100vh-5rem)] flex items-center overflow-hidden py-12 lg:py-24">
      {/* Showroom Ambient Golden Background Blobs */}
      <div className="absolute top-1/4 -right-64 w-128 h-128 bg-gradient-to-r from-amber-500/10 to-yellow-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-64 w-128 h-128 bg-gradient-to-r from-amber-200/5 to-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Premium Brand Content */}
          <div className="lg:col-span-6 flex flex-col gap-6 lg:gap-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="flex flex-col gap-3"
            >
              {/* Premium Category Pre-title */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-px bg-amber-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-amber-200">
                  Premium Designer Mirrors
                </span>
              </div>
              
              {/* Main Heading */}
              <h1 className="font-serif text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.1] md:leading-[1.15]">
                Reflect Your <br />
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent italic">
                  Signature Style
                </span>
              </h1>
            </motion.div>

            {/* Description Copy */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="text-stone-400 text-base md:text-lg max-w-xl font-sans leading-relaxed"
            >
              Luxury mirrors that redefine your space with elegance, sophistication and perfection. Handcrafted at our atelier to match your vision.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
            >
              <Link
                href="/collections"
                className="w-full sm:w-auto bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-500 hover:from-white hover:to-amber-200 text-stone-950 font-extrabold text-center uppercase tracking-widest text-xs px-8 py-4.5 rounded shadow-xl shadow-amber-500/10 hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                Explore Collection
              </Link>
              <Link
                href="/custom-mirrors"
                className="w-full sm:w-auto border border-amber-400/40 hover:border-white text-amber-200 hover:text-white font-extrabold text-center uppercase tracking-widest text-xs px-8 py-4.5 rounded bg-transparent hover:bg-stone-900/40 transition-all duration-300"
              >
                Custom Order
              </Link>
            </motion.div>

            {/* Premium Trust Icons/Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="border-t border-stone-900 pt-8 mt-4 grid grid-cols-2 sm:grid-cols-4 gap-6"
            >
              <div className="flex items-center gap-2.5">
                <Award className="h-5 w-5 text-amber-400 shrink-0" />
                <span className="text-[10px] sm:text-xs font-semibold tracking-wide text-stone-400 uppercase leading-snug">
                  Premium Quality
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-5 w-5 text-amber-400 shrink-0" />
                <span className="text-[10px] sm:text-xs font-semibold tracking-wide text-stone-400 uppercase leading-snug">
                  Custom Designs
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Layers className="h-5 w-5 text-amber-400 shrink-0" />
                <span className="text-[10px] sm:text-xs font-semibold tracking-wide text-stone-400 uppercase leading-snug">
                  Safe Packaging
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-5 w-5 text-amber-400 shrink-0" />
                <span className="text-[10px] sm:text-xs font-semibold tracking-wide text-stone-400 uppercase leading-snug">
                  Pan India Delivery
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Visual backlighting mirror with gentle float */}
          <div className="lg:col-span-6 flex justify-center items-center relative mt-8 lg:mt-0">
            {/* Visual Ambient Backlighting Glow (behind image) */}
            <div className="absolute w-64 h-96 sm:w-96 sm:h-[480px] rounded-3xl bg-amber-400/15 blur-3xl pointer-events-none" />

            {/* Framer Motion Float Animation */}
            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="group relative w-72 h-[420px] sm:w-[350px] sm:h-[500px] border border-amber-500/20 p-2 sm:p-3 rounded-[36px] bg-stone-900/20 backdrop-blur-sm overflow-hidden flex items-center justify-center shadow-2xl shadow-amber-500/5 select-none transition-all duration-500 hover:border-amber-400/40 hover:shadow-amber-500/10"
            >
              {/* Backlit Golden Ring Overlay */}
              <div className="absolute inset-0 rounded-[36px] border border-amber-400/10 pointer-events-none group-hover:border-amber-400/20 transition-colors duration-300 animate-pulse" />
              
              <div className="relative w-full h-full rounded-[28px] overflow-hidden">
                <Image
                  src="/images/artistic_black.jpg"
                  alt="Mirrorwala Luxury back-lit artistic black designer mirror"
                  fill
                  priority
                  sizes="(max-width: 640px) 280px, (max-width: 768px) 380px, 450px"
                  className="object-cover rounded-[28px] pointer-events-none transform transition-transform duration-700 group-hover:scale-105"
                />

                {/* Subtle Mirror Reflection Shimmer Animation */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
                  initial={{ x: '-150%', skewX: -20 }}
                  animate={{ x: '150%' }}
                  transition={{
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: 4,
                    ease: 'easeInOut',
                    repeatDelay: 1.5,
                  }}
                />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
