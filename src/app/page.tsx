import React from 'react';
import Navbar from '@/components/common/Navbar';
import Hero from '@/components/common/Hero';
import BrowseCategories from '@/components/common/BrowseCategories';
import TrustSection from '@/components/common/TrustSection';
import FeaturedCollections from '@/components/common/FeaturedCollections';
import CustomCTA from '@/components/common/CustomCTA';
import Transformation from '@/components/common/Transformation';
import Testimonials from '@/components/common/Testimonials';
import InstagramGallery from '@/components/common/InstagramGallery';
import Footer from '@/components/common/Footer';
import { AdminService } from '@/services/admin.service';

export default async function Home() {
  let testimonials = [];
  try {
    const cmsContent = await AdminService.getHomepageCMS('homepage_cms');
    if (cmsContent && cmsContent.value && typeof cmsContent.value === 'object') {
      testimonials = (cmsContent.value as any).testimonials || [];
    }
  } catch (error) {
    console.warn('⚠️ Note: Database is unreachable or offline. Homepage testimonials will fall back to empty.');
  }

  return (
    <div className="flex flex-col min-h-screen bg-stone-950 font-sans text-white overflow-x-hidden antialiased">
      {/* 1. Global Translucent Sticky Navigation */}
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* 2. Hero Presentation Showcase */}
        <Hero />

        {/* 3. Browse Mirror Catalog Categories */}
        <BrowseCategories />

        {/* 4. Atelier Trust Credentials */}
        <TrustSection />

        {/* 5. Editorial Featured Collections Gallery */}
        <FeaturedCollections />

        {/* 6. Custom Configurator CTA Banner */}
        <CustomCTA />

        {/* 7. Room Transformation Slider */}
        <Transformation />

        {/* 8. Elite Client Testimonials Carousel */}
        <Testimonials initialTestimonials={testimonials} />

        {/* 9. Instashowcase Portfolios */}
        <InstagramGallery />
      </main>

      {/* 10. Showroom Sitemap Footer */}
      <Footer />
    </div>
  );
}
