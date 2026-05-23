'use client';

import React, { useState } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import CloudinaryImage from '@/components/common/CloudinaryImage';
import { motion } from 'framer-motion';
import { Sparkles, SlidersHorizontal, Eye } from 'lucide-react';

const GALLERY_PHOTOS = [
  {
    id: 'photo_01',
    image: '/images/lightbulb_led.jpg',
    title: 'Aura Smart LED Bulb Mirror in Luxury Dressing Vanity',
    room: 'Dressing Room',
    location: 'Indore Residence',
    dimensions: '650mm x 900mm'
  },
  {
    id: 'photo_02',
    image: '/images/designer_category.png',
    title: 'Atelier Gold Baroque Frame Mirror in Classic Foyer',
    room: 'Living Room Lobby',
    location: 'Bhopal Villa',
    dimensions: '800mm x 1100mm'
  },
  {
    id: 'photo_03',
    image: '/images/green_organic.jpg',
    title: 'Designer Green Organic Leaf Shaped Mirror Statement Art',
    room: 'Hallway Passage',
    location: 'Ujjain Penthouse',
    dimensions: '600mm x 1250mm'
  },
  {
    id: 'photo_04',
    image: '/images/floral_engraved.jpg',
    title: 'Floral Engraved Modern Mirror in Premium Bathroom suite',
    room: 'Bathroom suite',
    location: 'Indore Residency Area',
    dimensions: '800mm x 1000mm'
  },
  {
    id: 'photo_05',
    image: '/images/artistic_black.jpg',
    title: 'Galaxy Mosaic Stained Glass Mirror Artistic Focal Piece',
    room: 'Living Room Lobby',
    location: 'Indore Atelier Specimen',
    dimensions: '700mm x 1200mm'
  },
  {
    id: 'photo_06',
    image: '/images/crystal_wavy.jpg',
    title: 'Luxury Faceted Crystal LED Irregular Vanity Suite',
    room: 'Bathroom suite',
    location: 'Dewas Naka Showroom',
    dimensions: '750mm x 1050mm'
  }
];

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const filteredPhotos = activeFilter === 'ALL'
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter(p => p.room.toLowerCase().includes(activeFilter.toLowerCase()));

  return (
    <PublicLayout>
      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[85vh] aspect-square w-full">
            <CloudinaryImage src={lightboxImage} alt="Luxury installation showcase" fill className="object-contain" />
          </div>
          <span className="absolute top-6 right-6 text-xs uppercase tracking-widest font-extrabold text-stone-400 bg-stone-900 border border-stone-800 px-4 py-2 rounded">
            Click Anywhere to Close
          </span>
        </div>
      )}

      {/* Header Banner */}
      <section className="relative py-20 bg-gradient-to-b from-stone-900 to-stone-950 border-b border-stone-900 text-center">
        <div className="container mx-auto px-4 md:px-8 flex flex-col items-center gap-4">
          <span className="text-xs uppercase tracking-widest text-amber-300 font-bold flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Room Transformations
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Client Showroom Portfolios
          </h1>
          <div className="w-20 h-0.5 bg-gradient-to-r from-amber-200 to-yellow-500 rounded my-1" />
          <p className="text-stone-400 max-w-xl text-xs leading-relaxed font-sans">
            Admire beautiful mirror installations in real-world luxury spaces. Each piece is custom crafted and hand-finished at our Indore atelier.
          </p>
        </div>
      </section>

      {/* Room Category filter controls */}
      <section className="bg-stone-950 py-5 border-b border-stone-900 sticky top-20 z-30 backdrop-blur-md bg-stone-950/80">
        <div className="container mx-auto px-4 md:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-stone-400 text-xs uppercase tracking-widest font-bold">
            <SlidersHorizontal className="h-4 w-4 text-amber-300" />
            <span>Filter By Space:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['ALL', 'Dressing', 'Living', 'Bathroom'].map((space) => (
              <button
                key={space}
                onClick={() => setActiveFilter(space)}
                className={`text-xs uppercase tracking-widest font-bold px-4 py-2 rounded transition-all duration-300 ${
                  activeFilter === space
                    ? 'bg-amber-400 text-stone-950 font-extrabold'
                    : 'bg-stone-900 text-stone-300 border border-stone-850 hover:bg-stone-850 hover:text-amber-200'
                }`}
              >
                {space}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Grid */}
      <section className="bg-stone-950 py-16 text-stone-300 font-sans">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="group relative flex flex-col bg-stone-900/40 rounded border border-stone-850 overflow-hidden hover:border-amber-500/20 transition-all duration-500 shadow-xl"
              >
                {/* Image panel */}
                <div className="relative h-80 w-full overflow-hidden select-none">
                  <CloudinaryImage src={photo.image} alt={photo.title} fill className="object-cover" />
                  
                  {/* Glassmorphism hover panel */}
                  <div className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <button
                      onClick={() => setLightboxImage(photo.image)}
                      className="p-3 bg-amber-400 text-stone-950 rounded-full font-bold flex items-center gap-1.5 shadow pointer-events-auto transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                    >
                      <Eye className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

                {/* Details caption */}
                <div className="p-4 flex flex-col gap-1 border-t border-stone-850/50 bg-stone-900/60">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[9px] uppercase tracking-widest text-amber-300 font-bold">{photo.room}</span>
                    <span className="text-[9px] text-stone-500 font-bold">{photo.dimensions}</span>
                  </div>
                  <h3 className="font-serif text-sm font-bold text-white mt-1 group-hover:text-amber-200 transition-colors">
                    {photo.title}
                  </h3>
                  <span className="text-[9px] text-stone-500 font-sans">{photo.location}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
