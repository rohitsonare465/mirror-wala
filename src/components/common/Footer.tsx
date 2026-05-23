'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { FOOTER_COMPANY_LINKS, FOOTER_SUPPORT_LINKS } from '@/constants/navigation';

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

const Facebook = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Twitter = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export default function Footer() {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Newsletter] Subscribed');
  };

  return (
    <footer className="bg-stone-950 border-t border-amber-500/10 text-stone-400 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info & Newsletter */}
          <div className="flex flex-col gap-6">
            <div>
              <Link href="/" className="flex items-center gap-2.5 group select-none">
                <img
                  src="/images/logo.jpg"
                  alt="Mirrorwala Logo"
                  className="h-10 w-10 object-contain rounded-full border border-amber-500/20 group-hover:border-amber-400/50 transition-colors duration-300"
                />
                <span className="font-serif text-xl font-bold tracking-wider bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent group-hover:from-white transition-all duration-300">
                  Mirrorwala
                </span>
              </Link>
              <p className="mt-4 text-sm text-stone-500 font-sans leading-relaxed">
                Handcrafting premium luxury mirrors that redefine modern visual spaces with elegance, reflection, and technological perfection.
              </p>
            </div>

            {/* Premium Newsletter Sign-up */}
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-widest text-stone-200 font-bold">
                Elite Showroom Newsletter
              </span>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter email for private drops..."
                  className="bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-400 px-4 py-2 text-sm rounded transition-all duration-300 w-full"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-200 to-yellow-500 hover:from-white hover:to-amber-200 text-stone-950 px-5 py-2 text-xs uppercase tracking-wider font-extrabold rounded transition-all duration-300 cursor-pointer shadow-lg shadow-amber-500/10"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h3 className="font-serif text-lg text-stone-200 font-bold mb-6 tracking-wide">
              Showroom Catalog
            </h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link href="/collections" className="hover:text-amber-200 transition-colors duration-200">
                  LED Smart Mirrors
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-amber-200 transition-colors duration-200">
                  Champagne Ornate Framed Mirrors
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-amber-200 transition-colors duration-200">
                  Organic Art Mirrors
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-amber-200 transition-colors duration-200">
                  Classic Minimalist Wall Mirrors
                </Link>
              </li>
              <li>
                <Link href="/custom-mirrors" className="hover:text-amber-200 transition-colors duration-200 flex items-center gap-1.5">
                  <span>Custom Requisitions</span>
                  <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded font-bold uppercase tracking-normal">
                    Quote
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Nav & Help */}
          <div>
            <h3 className="font-serif text-lg text-stone-200 font-bold mb-6 tracking-wide">
              Customer Concierge
            </h3>
            <ul className="flex flex-col gap-3 text-sm">
              {FOOTER_COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-amber-200 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
              {FOOTER_SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-amber-200 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details & Showroom Location */}
          <div>
            <h3 className="font-serif text-lg text-stone-200 font-bold mb-6 tracking-wide">
              The Flagship Atelier
            </h3>
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed text-stone-400">
                  Plot No 4, near Dewas Naka, Sector A, Industrial Area, Indore, MP, 452010, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                <a href="tel:+919111256684" className="hover:text-amber-200 transition-colors duration-200">
                  +91 91112 56684 / +91 88714 04545
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                <a href="mailto:atelier@mirrorwala.in" className="hover:text-amber-200 transition-colors duration-200">
                  atelier@mirrorwala.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar Details */}
        <div className="flex flex-col sm:flex-row h-full items-center justify-between border-t border-stone-900 pt-8 mt-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-4 sm:mb-0">
            <span className="text-xs text-stone-600 font-sans">
              © {new Date().getFullYear()} Mirrorwala. All rights reserved.
            </span>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-600">
              <ShieldCheck className="h-4 w-4 text-amber-500/40" />
              <span>Registered Luxury Handcraft Atelier India</span>
            </div>
          </div>

          {/* Social Icons grids */}
          <div className="flex gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Link"
              className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-200 hover:border-amber-400 transition-all duration-300"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook Link"
              className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-200 hover:border-amber-400 transition-all duration-300"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter Link"
              className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-200 hover:border-amber-400 transition-all duration-300"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
