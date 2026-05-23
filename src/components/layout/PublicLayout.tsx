import React from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
}

/**
 * Premium shell wrapper for Mirrorwala public customer-facing screens.
 * Integrates global navigation header and editorial sitemap footer.
 */
export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-stone-950 font-sans text-stone-200 overflow-x-hidden antialiased">
      {/* Global Translucent Sticky Navbar */}
      <Navbar />
      
      {/* Central Viewport Grid */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Luxury Showroom Footer */}
      <Footer />
    </div>
  );
}
