'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface CollectionItem {
  title: string;
  subtitle: string;
  image: string;
  href: string;
  cols: string; // Tailwind grid span rule
  height: string;
}

const COLLECTIONS: CollectionItem[] = [
  {
    title: 'LED Collection',
    subtitle: 'Aura Smart LED Silhouette Bulb Mirror',
    image: '/images/lightbulb_led.jpg',
    href: '/products/aura-smart-led-bulb-mirror',
    cols: 'lg:col-span-6',
    height: 'h-96 md:h-112',
  },
  {
    title: 'Luxury Collection',
    subtitle: 'Atelier Baroque Handcrafted Gold Irregular Mirror',
    image: '/images/designer_category.png',
    href: '/products/designer-gold-frame-mirror',
    cols: 'lg:col-span-6',
    height: 'h-96 md:h-112',
  },
  {
    title: 'Designer Collection',
    subtitle: 'Atelier Faceted Wavy Crystal LED Mirror',
    image: '/images/crystal_wavy.jpg',
    href: '/products/luxury-led-crystal-mirror',
    cols: 'lg:col-span-4',
    height: 'h-96 md:h-128',
  },
  {
    title: 'Art Collection',
    subtitle: 'Vibrant Forest Green Organic Leaf Accent Mirror',
    image: '/images/green_organic.jpg',
    href: '/products/designer-green-organic-mirror',
    cols: 'lg:col-span-4',
    height: 'h-96 md:h-128',
  },
  {
    title: 'Premium Collection',
    subtitle: 'Galaxy Mosaic Stained Glass Artistic Mirror',
    image: '/images/artistic_black.jpg',
    href: '/products/galaxy-mosaic-art-mirror',
    cols: 'lg:col-span-4',
    height: 'h-96 md:h-128',
  },
  {
    title: 'Modern Collection',
    subtitle: 'Atelier Diamond-Engraved Floral Modern Mirror',
    image: '/images/floral_engraved.jpg',
    href: '/products/floral-engraved-modern-mirror',
    cols: 'lg:col-span-12',
    height: 'h-96 md:h-112',
  },
];

export default function FeaturedCollections() {
  return (
    <section className="bg-stone-950 py-20 border-t border-stone-900 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="flex flex-col gap-4 text-left">
            <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">
              Elite Curations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Featured Collections
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-amber-200 to-yellow-500 rounded" />
          </div>
          <p className="text-stone-400 max-w-md text-sm font-sans leading-relaxed md:mb-2">
            A hand-picked selection of our most exquisite collections, curated by premium architects for high-end luxury residential projects.
          </p>
        </div>

        {/* Asymmetrical Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {COLLECTIONS.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={item.cols}
            >
              <div className={`group relative ${item.height} rounded overflow-hidden bg-stone-900 border border-stone-850 shadow-2xl hover:border-amber-500/20 transition-all duration-500`}>
                
                {/* Image Component with slow zoom */}
                <div className="absolute inset-0 w-full h-full select-none">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 75vw"
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                  
                  {/* Subtle Dark Gold Mask Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-stone-900/10 opacity-75 group-hover:opacity-85 transition-opacity duration-500" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                  <div className="flex flex-col gap-2 max-w-lg">
                    {/* Collection Badge */}
                    <div className="flex items-center gap-2 text-amber-300 opacity-90">
                      <Sparkles className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                        Atelier Showcase
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide group-hover:text-amber-200 transition-colors duration-300">
                      {item.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-stone-400 font-sans leading-relaxed">
                      {item.subtitle}
                    </p>

                    {/* View Collection Link */}
                    <div className="pt-4 flex items-center gap-1.5 text-stone-200 group-hover:text-amber-200 text-xs font-bold uppercase tracking-widest transition-colors duration-300">
                      <Link href={item.href} className="flex items-center gap-1.5 cursor-pointer">
                        <span>Explore Collection</span>
                        <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
