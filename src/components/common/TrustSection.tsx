'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Box, Headphones } from 'lucide-react';

interface TrustCard {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const TRUST_CARDS: TrustCard[] = [
  {
    icon: Shield,
    title: 'Copper-Free Glass',
    description: 'Atelier mirrors utilize 5mm copper-free Saint-Gobain glass that prevents edge corrosion and black spots, offering unparalleled HD reflection.',
  },
  {
    icon: Sparkles,
    title: 'Custom Made Atelier',
    description: 'Every mirror is custom-engineered to your exact dimensions, shape, lighting preference, and sensory triggers. Built bespoke for your room.',
  },
  {
    icon: Box,
    title: 'Luxury Crate Transit',
    description: 'Packaged in triple-layered reinforced wooden crates. 100% shipping protection guaranteed — any transit break gets a direct, free replacement.',
  },
  {
    icon: Headphones,
    title: 'Designer Support',
    description: 'Direct designer assistance for custom sizes. Speak directly to our mirror engineers for architectural blueprints and led hookup details.',
  },
];

export default function TrustSection() {
  return (
    <section className="bg-stone-900/40 py-20 border-t border-stone-900/60 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Grids Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TRUST_CARDS.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-stone-950/80 border border-stone-900 hover:border-amber-500/10 p-8 rounded shadow-lg shadow-black/20 hover:shadow-amber-500/5 transition-all duration-300 flex flex-col gap-4 group"
              >
                {/* Glowing Gold Icon Bubble */}
                <div className="w-12 h-12 rounded-full bg-amber-400/5 border border-amber-400/20 flex items-center justify-center text-amber-300 group-hover:bg-amber-400/10 group-hover:text-amber-200 transition-colors duration-300 shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                
                <h3 className="font-serif text-lg font-bold text-white tracking-wide group-hover:text-amber-200 transition-colors duration-300 mt-2">
                  {card.title}
                </h3>
                
                <p className="text-stone-400 text-xs sm:text-sm font-sans leading-relaxed">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
