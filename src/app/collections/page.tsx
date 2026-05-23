'use client';

import React, { useState } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import CloudinaryImage from '@/components/common/CloudinaryImage';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, SlidersHorizontal, ArrowRight, ArrowUpDown } from 'lucide-react';

const COLLECTIONS = [
  {
    id: 'aura-smart-led-bulb-mirror',
    name: 'LED Mirrors',
    slug: 'aura-smart-led-bulb-mirror',
    description: 'Tri-color dimmable silhouette LED vanity mirrors with integrated anti-fog touch sensors.',
    image: '/images/lightbulb_led.jpg',
    priceRange: '₹19,999 - ₹24,000',
    count: 'Aura Silhouette',
    tag: 'Smart',
  },
  {
    id: 'designer-gold-frame-mirror',
    name: 'Designer Gold Frames',
    slug: 'designer-gold-frame-mirror',
    description: 'Champagne gold irregular frames and vintage luxury carvings in premium fluid layouts.',
    image: '/images/designer_category.png',
    priceRange: '₹38,000 - ₹42,000',
    count: 'Atelier Gold',
    tag: 'Luxury',
  },
  {
    id: 'galaxy-mosaic-art-mirror',
    name: 'Art & Mosaic Mirrors',
    slug: 'galaxy-mosaic-art-mirror',
    description: 'Handcrafted black silhouette frames adorned with premium stained glass mosaic accents.',
    image: '/images/artistic_black.jpg',
    priceRange: '₹29,999 - ₹34,000',
    count: 'Galaxy Mosaic',
    tag: 'Artisanal',
  },
  {
    id: 'luxury-led-crystal-mirror',
    name: 'Luxury Crystal Mirrors',
    slug: 'luxury-led-crystal-mirror',
    description: 'Faceted crystal glass borders lined with high-CRI sandblasted dual-glow LED strips.',
    image: '/images/crystal_wavy.jpg',
    priceRange: '₹42,500 - ₹48,000',
    count: 'Faceted Crystal',
    tag: 'Exquisite',
  },
  {
    id: 'designer-green-organic-mirror',
    name: 'Green Organic Accent Mirrors',
    slug: 'designer-green-organic-mirror',
    description: 'Fluid organic contours finished in forest green high-gloss enamel for natural showroom vibes.',
    image: '/images/green_organic.jpg',
    priceRange: '₹24,500 - ₹28,000',
    count: 'Leaf Contours',
    tag: 'Organic',
  },
  {
    id: 'floral-engraved-modern-mirror',
    name: 'Floral Engraved Mirrors',
    slug: 'floral-engraved-modern-mirror',
    description: 'Modern frameless mirrors with delicate diamond-engraved custom organic leaf trims.',
    image: '/images/floral_engraved.jpg',
    priceRange: '₹32,000 - ₹36,000',
    count: 'Floral Etched',
    tag: 'Modern',
  },
];

export default function CollectionsPage() {
  const [filter, setFilter] = useState('ALL');

  return (
    <PublicLayout>
      {/* Header Banner */}
      <section className="relative py-24 bg-gradient-to-b from-stone-900 to-stone-950 border-b border-stone-900">
        <div className="container mx-auto px-4 md:px-8 text-center flex flex-col items-center gap-4">
          <span className="text-xs uppercase tracking-widest text-amber-300 font-bold flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" /> The Showroom Catalog
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Atelier Collections
          </h1>
          <div className="w-20 h-0.5 bg-gradient-to-r from-amber-200 to-yellow-500 rounded my-2" />
          <p className="text-stone-400 max-w-xl text-sm leading-relaxed font-sans">
            Explore our curated collections of premium mirrors, hand-finished to become the striking focal point of your luxury interior space.
          </p>
        </div>
      </section>

      {/* Catalog Filters Controls */}
      <section className="bg-stone-950 py-6 border-b border-stone-900 sticky top-20 z-30 backdrop-blur-md bg-stone-950/80">
        <div className="container mx-auto px-4 md:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-stone-400 text-xs uppercase tracking-widest font-bold">
            <SlidersHorizontal className="h-4 w-4 text-amber-300" />
            <span>Filter By Style:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['ALL', 'LED', 'CLASSIC', 'BESPOKE'].map((style) => (
              <button
                key={style}
                onClick={() => setFilter(style)}
                className={`text-xs uppercase tracking-widest font-bold px-4 py-2 rounded transition-all duration-300 ${
                  (style === 'ALL' && filter === 'ALL') ||
                  (style === 'LED' && filter === 'LED') ||
                  (style === 'CLASSIC' && filter === 'CLASSIC') ||
                  (style === 'BESPOKE' && filter === 'BESPOKE')
                    ? 'bg-amber-400 text-stone-950 font-extrabold shadow-md shadow-amber-400/10'
                    : 'bg-stone-900 text-stone-300 border border-stone-850 hover:bg-stone-850 hover:text-amber-200'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-stone-400 text-xs uppercase tracking-widest font-bold">
            <ArrowUpDown className="h-4 w-4" />
            <span>Sort: Featured</span>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="bg-stone-950 py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {COLLECTIONS.map((col, idx) => (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative flex flex-col bg-stone-900/60 rounded border border-stone-850 overflow-hidden shadow-xl shadow-black/40 hover:border-amber-500/20 transition-all duration-500"
              >
                {/* Image Section */}
                <div className="relative h-72 w-full overflow-hidden select-none">
                  <CloudinaryImage
                    src={col.image}
                    alt={col.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-transparent" />
                  <span className="absolute top-4 right-4 text-[9px] uppercase tracking-widest font-extrabold bg-gradient-to-r from-amber-300 to-amber-500 text-stone-950 px-2 py-0.5 rounded shadow">
                    {col.tag}
                  </span>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold tracking-widest text-amber-300 uppercase">
                      {col.count}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-amber-200 transition-colors duration-300">
                      {col.name}
                    </h3>
                    <p className="text-xs text-stone-400 leading-relaxed font-sans">
                      {col.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-stone-850/60">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-widest text-stone-500 font-bold">Price range</span>
                      <span className="text-xs font-bold text-stone-200">{col.priceRange}</span>
                    </div>

                    <Link
                      href={`/products/${col.slug}`}
                      className="flex items-center gap-1 text-xs uppercase tracking-widest font-extrabold text-amber-300 group-hover:text-white transition-colors duration-300"
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
