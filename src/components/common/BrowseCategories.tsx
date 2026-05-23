'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface CategoryCard {
  title: string;
  count: string;
  image: string;
  href: string;
  description: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    title: 'LED Smart Mirrors',
    count: '24 Designs',
    image: '/images/lightbulb_led.jpg',
    href: '/collections',
    description: 'Sandblasted glows, touch controls, and anti-fog demisters.',
  },
  {
    title: 'Designer Mirrors',
    count: '18 Designs',
    image: '/images/designer_category.png',
    href: '/collections',
    description: 'Champagne gold ornate frames and vintage luxury carvings.',
  },
  {
    title: 'Artistic Mirrors',
    count: '12 Designs',
    image: '/images/green_organic.jpg',
    href: '/collections',
    description: 'Organic asymmetrical geometry and museum-grade frameless glass.',
  },
  {
    title: 'Wall Mirrors',
    count: '32 Designs',
    image: '/images/artistic_black.jpg',
    href: '/collections',
    description: 'Timeless rectangular, round and arched minimalist pieces.',
  },
  {
    title: 'Bespoke Mirrors',
    count: 'Unlimited',
    image: '/images/crystal_wavy.jpg',
    href: '/custom-mirrors',
    description: 'Tailored dimensions, custom edge styles and smart integrations.',
  },
  {
    title: 'Full Length Mirrors',
    count: '15 Designs',
    image: '/images/floral_engraved.jpg',
    href: '/collections',
    description: 'Grand floorstanding lookbooks and dressing room essentials.',
  },
];

export default function BrowseCategories() {
  return (
    <section className="bg-stone-950 py-20 border-t border-stone-900">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">
            The Showroom Catalog
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Browse By Category
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-amber-200 to-yellow-500 rounded" />
          <p className="text-stone-400 max-w-xl text-sm font-sans mt-2">
            Explore our curated collections of premium mirrors, each designed to become the striking visual focal point of your interior space.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative h-96 rounded overflow-hidden bg-stone-900 border border-stone-800/80 shadow-xl shadow-black/30 hover:border-amber-500/20 transition-all duration-500"
            >
              {/* Image Container with Hover Zoom */}
              <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Champagne Gold/Warm Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-900/10 opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                {/* Gold Highlight Border on Hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-400/25 transition-colors duration-500 rounded pointer-events-none" />
              </div>

              {/* Card Contents */}
              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col gap-3 relative z-10 h-full justify-end">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
                    {category.count}
                  </span>
                </div>
                
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-amber-200 transition-colors duration-300">
                  {category.title}
                </h3>
                
                <p className="text-xs text-stone-400 font-sans leading-relaxed opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-16 transition-all duration-500 ease-in-out">
                  {category.description}
                </p>

                {/* View Collection Line Button */}
                <div className="pt-2 flex items-center gap-1 text-stone-300 group-hover:text-amber-200 transition-colors duration-300 text-xs uppercase tracking-widest font-extrabold">
                  <Link href={category.href} className="flex items-center gap-1 cursor-pointer">
                    <span>View Collection</span>
                    <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
