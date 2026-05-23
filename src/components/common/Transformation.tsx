'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Sparkles } from 'lucide-react';

export default function Transformation() {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0-100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <section className="bg-stone-950 py-24 border-t border-stone-900 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">
            Dramatic Spaces
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Room Transformation
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-amber-200 to-yellow-500 rounded" />
          <p className="text-stone-400 max-w-xl text-sm font-sans mt-2">
            Witness how mounting a handcrafted Mirrorwala luxury piece instantly converts a dull, flat wall into a premium, deep visual masterpiece.
          </p>
        </div>

        {/* Interactive Comparison Slider Container */}
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative h-[350px] sm:h-[450px] md:h-[520px] w-full rounded overflow-hidden select-none border border-stone-900 shadow-2xl shadow-black cursor-ew-resize"
          >
            {/* 1. BEFORE IMAGE (Full Background) */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src="/images/before_room.png"
                alt="Bare concrete wall before mirror setup"
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover pointer-events-none"
              />
              {/* "Before" Text Overlay */}
              <div className="absolute bottom-6 left-6 z-20 bg-stone-950/80 border border-stone-850 px-4 py-1.5 rounded text-xs uppercase tracking-widest font-extrabold text-stone-300 backdrop-blur-sm">
                Before Setup
              </div>
            </div>

            {/* 2. AFTER IMAGE (Clipped Overlay width controlled by state) */}
            <div
              className="absolute inset-0 z-10 w-full h-full overflow-hidden"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
              <Image
                src="/images/after_room.png"
                alt="Luxury bathroom marble wall with backlit arched mirror installed"
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover pointer-events-none"
              />
              {/* "After" Text Overlay */}
              <div className="absolute bottom-6 right-6 z-20 bg-gradient-to-r from-amber-200 to-yellow-500 border border-amber-300 px-4 py-1.5 rounded text-xs uppercase tracking-widest font-extrabold text-stone-950 shadow-lg shadow-amber-500/20 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Atelier Mounted</span>
              </div>
            </div>

            {/* 3. SLIDER BAR DIVIDER */}
            <div
              className="absolute inset-y-0 z-20 w-0.5 bg-gradient-to-b from-amber-200 via-amber-400 to-yellow-500"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Drag Handle Bubble */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-stone-950 border border-amber-400 flex items-center justify-center text-amber-300 shadow-xl shadow-black/50 select-none">
                <ArrowLeftRight className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Interactive Help Hint */}
          <span className="text-[10px] text-stone-500 font-sans uppercase tracking-widest text-center">
            ← Hover or Slide your cursor horizontally across the image frame to compare →
          </span>
        </div>

      </div>
    </section>
  );
}
