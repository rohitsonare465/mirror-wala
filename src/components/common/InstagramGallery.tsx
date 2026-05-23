'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const Instagram = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

interface InstagramPost {
  image: string;
  tag: string;
  likes: string;
}

const INSTA_POSTS: InstagramPost[] = [
  {
    image: '/images/crystal_wavy.jpg',
    tag: '#LuxuryCrystalLED',
    likes: '1,425 Likes',
  },
  {
    image: '/images/lightbulb_led.jpg',
    tag: '#AuraSmartLED',
    likes: '2,612 Likes',
  },
  {
    image: '/images/designer_category.png',
    tag: '#LivingRoomGoldBaroque',
    likes: '3,891 Likes',
  },
  {
    image: '/images/artistic_black.jpg',
    tag: '#StainedGlassMosaicArt',
    likes: '1,512 Likes',
  },
];

export default function InstagramGallery() {
  return (
    <section className="bg-stone-950 py-20 border-t border-stone-900 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <span className="text-xs uppercase tracking-widest text-amber-300 font-bold flex items-center gap-1.5">
            <Instagram className="h-4 w-4" />
            <span>@MirrorwalaShowroom</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Atelier in Customer Homes
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-amber-200 to-yellow-500 rounded" />
          <p className="text-stone-400 max-w-xl text-sm font-sans mt-2">
            Get inspired by real architectural snapshots showing how Mirrorwala custom installations bring light, reflection, and symmetry to luxury residences.
          </p>
        </div>

        {/* Instashowcase Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {INSTA_POSTS.map((post, index) => (
            <motion.div
              key={post.image}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative aspect-square rounded overflow-hidden bg-stone-900 border border-stone-900 hover:border-amber-400/20 transition-all duration-500 cursor-pointer shadow-lg shadow-black/20"
            >
              {/* Instagram Image */}
              <div className="absolute inset-0 w-full h-full select-none">
                <Image
                  src={post.image}
                  alt={`Mirrorwala home setup: ${post.tag}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Dark Hover Mask */}
                <div className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 z-10" />
              </div>

              {/* Instagram Hover Controls */}
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                <Instagram className="h-6 w-6 text-amber-300 mb-1" />
                <span className="text-xs font-bold text-white tracking-wide">
                  {post.tag}
                </span>
                <span className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">
                  {post.likes}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
