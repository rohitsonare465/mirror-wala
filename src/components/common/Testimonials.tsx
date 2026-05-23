'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

interface TestimonialCard {
  name: string;
  city: string;
  rating: number;
  review: string;
  product: string;
  initials: string;
  avatarUrl?: string;
}

const TESTIMONIALS: TestimonialCard[] = [
  {
    name: 'Ananya Sharma',
    city: 'Mumbai',
    rating: 5,
    review: 'We commissioned a 7-foot bespoke arched backlit LED mirror for our master bathroom. The Saint-Gobain glass clarity is breathtaking. The defogger pad works in under 60 seconds and keeps steam completely off. Packaging was an absolute heavy-duty wooden crate fortress!',
    product: 'Bespoke LED Arched Mirror (800x1200mm)',
    initials: 'AS',
  },
  {
    name: 'Vikram Malhotra',
    city: 'New Delhi',
    rating: 5,
    review: 'Atelier Mirrorwala is top-class. I ordered the ornate carved champagne gold framed mirror for our formal living area console. It looks like a museum masterpiece. The gold finish has exactly the right understated luxury sheen without being overly glossy.',
    product: 'Grand Classical Ornate Gold Mirror',
    initials: 'VM',
  },
  {
    name: 'Rohan Deshmukh',
    city: 'Bengaluru',
    rating: 5,
    review: 'Our interior architect recommended Mirrorwala for our high-end residential project. We bought 3 smart LED round mirrors with tri-color touch sensors. The stepless dimming lets us adjust the glow from task daylight white to warm evening light. Exceptional service!',
    product: 'Round Smart LED Mirror with Tri-Color',
    initials: 'RD',
  },
];

interface TestimonialsProps {
  initialTestimonials?: any[];
}

export default function Testimonials({ initialTestimonials }: TestimonialsProps) {
  const testimonialsToRender = initialTestimonials && initialTestimonials.length > 0
    ? initialTestimonials.map(t => {
        // split role by comma to extract city if possible, fallback to whole role
        const roleParts = t.role ? t.role.split(',') : [];
        const city = roleParts.length > 1 ? roleParts[roleParts.length - 1].trim() : (t.role || 'Verified Customer');
        const product = roleParts.length > 1 ? roleParts.slice(0, -1).join(',').trim() : 'Premium Custom Mirror';
        
        // generate initials from name
        const initials = t.name
          ? t.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
          : 'M';

        return {
          name: t.name,
          city: city,
          rating: t.rating || 5,
          review: t.quote || '',
          product: product,
          initials: initials,
          avatarUrl: t.avatarUrl || '',
        };
      })
    : TESTIMONIALS;

  return (
    <section className="bg-stone-900/40 py-20 border-t border-stone-900/60 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">
            Verified Experiences
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Client Testimonials
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-amber-200 to-yellow-500 rounded" />
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsToRender.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-stone-950 border border-stone-900/60 hover:border-amber-500/10 p-8 rounded shadow-lg shadow-black/20 flex flex-col justify-between relative group"
            >
              {/* Quote Mark Watermark */}
              <Quote className="absolute top-6 right-6 h-8 w-8 text-stone-900/50 group-hover:text-amber-500/5 transition-colors duration-300" />
              
              <div className="flex flex-col gap-4">
                {/* Gold Stars */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                
                {/* Review Message */}
                <p className="text-stone-300 text-sm font-sans leading-relaxed italic">
                  "{testimonial.review}"
                </p>
              </div>

              {/* Customer Profile Footer */}
              <div className="flex items-center gap-4 border-t border-stone-900 pt-6 mt-6">
                {/* Profile avatar / initials */}
                {testimonial.avatarUrl ? (
                  <div className="w-10 h-10 rounded-full border border-amber-400/25 overflow-hidden flex items-center justify-center bg-stone-950">
                    <img 
                      src={testimonial.avatarUrl} 
                      alt={`${testimonial.name}'s profile picture`}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200/10 to-yellow-500/5 border border-amber-400/25 flex items-center justify-center text-xs font-bold text-amber-300 select-none">
                    {testimonial.initials}
                  </div>
                )}
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-white tracking-wide">
                    {testimonial.name}
                  </span>
                  <span className="text-[10px] text-stone-500 uppercase tracking-widest font-sans font-medium">
                    {testimonial.city} • {testimonial.product}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
