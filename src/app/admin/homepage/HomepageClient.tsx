'use client';

import React, { useState } from 'react';
import { 
  Save, 
  Plus, 
  Trash2, 
  Sparkles, 
  RefreshCw, 
  Image as ImageIcon,
  MessageSquare,
  Volume2,
  Tv,
  ArrowRight,
  Star
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { saveHomepageCMSAction } from '@/actions/admin';
import { useRouter } from 'next/navigation';
import FileUpload from '@/components/ui/FileUpload';

interface Slider {
  imageUrl: string;
  title: string;
  subtitle: string;
  btnLink: string;
  btnText: string;
}

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatarUrl?: string;
}

interface HomepageCMSContent {
  sliders: Slider[];
  testimonials: Testimonial[];
  promoText: string;
  announcementActive: boolean;
  announcementText: string;
}

interface HomepageClientProps {
  initialContent: any;
}

export default function HomepageClient({ initialContent }: HomepageClientProps) {
  const router = useRouter();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'sliders' | 'testimonials' | 'promo'>('sliders');
  const [isSaving, setIsSaving] = useState(false);

  // Cast initial content or use elegant premium defaults
  const [cmsData, setCmsData] = useState<HomepageCMSContent>(() => {
    const defaultData: HomepageCMSContent = {
      sliders: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
          title: 'LUXURY BACKLIT SMART MIRRORS',
          subtitle: 'Transform your bathroom vanity with premium touch-sensor dimmable LEDs.',
          btnLink: '/collections/led-mirrors',
          btnText: 'DISCOVER COLLECTION'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
          title: 'BESPOKE DESIGN COMPOSITIONS',
          subtitle: 'Custom shape configurations hand-crafted to fit your architectural spaces.',
          btnLink: '/customization',
          btnText: 'START CONFIGURATOR'
        }
      ],
      testimonials: [
        {
          name: 'Ananya Sharma',
          role: 'Interior Designer, Mumbai',
          quote: 'Mirrorwala has completely redefined premium vanity setups in India. The light diffusion and touch controls are absolute perfection.',
          rating: 5
        },
        {
          name: 'Kabir Mehta',
          role: 'Architectural Consultant',
          quote: 'The organic shape mirror I ordered customized to my client\'s dimensions is breathtaking. Exceptional clarity and robust mounting.',
          rating: 5
        }
      ],
      promoText: 'SUMMER VIBES: GET FLAT 10% OFF USING VOUCHER CODE GLAM10 AT CHECKOUT',
      announcementActive: true,
      announcementText: '✨ FREE PREMIUM CRATE DELIVERY & TRANSIT INSURANCE ON ORDERS OVER ₹15,000! ✨'
    };

    if (initialContent) {
      return {
        sliders: Array.isArray(initialContent.sliders) ? initialContent.sliders : defaultData.sliders,
        testimonials: Array.isArray(initialContent.testimonials)
          ? initialContent.testimonials.map((t: any) => ({
              ...t,
              avatarUrl: t.avatarUrl || '',
            }))
          : defaultData.testimonials,
        promoText: typeof initialContent.promoText === 'string' ? initialContent.promoText : defaultData.promoText,
        announcementActive: typeof initialContent.announcementActive === 'boolean' ? initialContent.announcementActive : defaultData.announcementActive,
        announcementText: typeof initialContent.announcementText === 'string' ? initialContent.announcementText : defaultData.announcementText,
      };
    }
    return defaultData;
  });

  const handleSaveCMS = async () => {
    setIsSaving(true);
    try {
      await saveHomepageCMSAction('homepage_cms', cmsData);
      toast.success('Homepage CMS parameters and text overrides successfully updated in DB.', 'CMS Saved');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed.', 'Database Error');
    } finally {
      setIsSaving(false);
    }
  };

  // Sliders helpers
  const handleUpdateSlider = (index: number, field: keyof Slider, value: string) => {
    const updated = [...cmsData.sliders];
    updated[index] = { ...updated[index], [field]: value };
    setCmsData(prev => ({ ...prev, sliders: updated }));
  };

  const handleAddSlider = () => {
    const defaultSlider: Slider = {
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      title: 'LUXURY CUSTOM SPEC SETUP',
      subtitle: 'Premium vanity touch mirrors handcrafted with edge-light frames.',
      btnLink: '/collections',
      btnText: 'BROWSE CATALOG'
    };
    setCmsData(prev => ({ ...prev, sliders: [...prev.sliders, defaultSlider] }));
    toast.info('New blank hero slider added below.', 'Slider Added');
  };

  const handleRemoveSlider = (index: number) => {
    if (cmsData.sliders.length <= 1) {
      toast.error('You must keep at least one hero banner slide active.', 'Action Denied');
      return;
    }
    setCmsData(prev => ({ ...prev, sliders: prev.sliders.filter((_, i) => i !== index) }));
    toast.success('Hero banner slide removed from staging queue.', 'Slide Removed');
  };



  // Testimonials helpers
  const handleUpdateTestimonial = (index: number, field: keyof Testimonial, value: any) => {
    const updated = [...cmsData.testimonials];
    updated[index] = { ...updated[index], [field]: value };
    setCmsData(prev => ({ ...prev, testimonials: updated }));
  };

  const handleAddTestimonial = () => {
    const newTestimonial: Testimonial = {
      name: 'Client Reviewer',
      role: 'Homeowner, Bangalore',
      quote: 'The mirror looks incredibly premium. Highly recommend Mirrorwala for custom backlit vanity layouts.',
      rating: 5,
      avatarUrl: '',
    };
    setCmsData(prev => ({ ...prev, testimonials: [...prev.testimonials, newTestimonial] }));
  };

  const handleRemoveTestimonial = (index: number) => {
    setCmsData(prev => ({ ...prev, testimonials: prev.testimonials.filter((_, i) => i !== index) }));
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Controls header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-amber-300 font-extrabold font-sans">Content Management</span>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">Homepage CMS Override</h1>
          <p className="text-xs text-stone-400 mt-0.5">Control slider graphics, promotional callouts, active notice overlays, and testimonials.</p>
        </div>
        <button
          onClick={handleSaveCMS}
          disabled={isSaving}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-extrabold uppercase tracking-widest text-[10px] py-3.5 px-6 rounded-md hover:from-white hover:to-amber-200 transition-all duration-300 cursor-pointer shadow-lg shadow-amber-400/5"
        >
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" /> Publishing...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Save Homepage Layout
            </>
          )}
        </button>
      </div>

      {/* Tab selection */}
      <div className="flex border-b border-stone-850 select-none">
        <button
          onClick={() => setActiveTab('sliders')}
          className={`flex items-center gap-2 px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-widest border-b-2 transition-all duration-300 cursor-pointer ${
            activeTab === 'sliders' 
              ? 'border-amber-400 text-amber-300' 
              : 'border-transparent text-stone-400 hover:text-white'
          }`}
        >
          <Tv className="h-4 w-4" /> Slider Carousels ({cmsData.sliders.length})
        </button>
        <button
          onClick={() => setActiveTab('testimonials')}
          className={`flex items-center gap-2 px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-widest border-b-2 transition-all duration-300 cursor-pointer ${
            activeTab === 'testimonials' 
              ? 'border-amber-400 text-amber-300' 
              : 'border-transparent text-stone-400 hover:text-white'
          }`}
        >
          <MessageSquare className="h-4 w-4" /> Showroom Reviews ({cmsData.testimonials.length})
        </button>
        <button
          onClick={() => setActiveTab('promo')}
          className={`flex items-center gap-2 px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-widest border-b-2 transition-all duration-300 cursor-pointer ${
            activeTab === 'promo' 
              ? 'border-amber-400 text-amber-300' 
              : 'border-transparent text-stone-400 hover:text-white'
          }`}
        >
          <Volume2 className="h-4 w-4" /> Announcement Alerts
        </button>
      </div>

      {/* Main CMS Editor panels */}
      <div className="bg-stone-900 border border-stone-850 p-6 rounded-md shadow-xl">
        
        {/* CAROUSEL SLIDERS PANEL */}
        {activeTab === 'sliders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center select-none border-b border-stone-850 pb-4">
              <span className="text-[10px] uppercase font-black tracking-widest text-stone-400">Hero Carousel Banners</span>
              <button
                onClick={handleAddSlider}
                className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-amber-300 hover:text-white transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> Add slide panel
              </button>
            </div>

            <div className="space-y-6 divide-y divide-stone-850/60">
              {cmsData.sliders.map((slider, index) => (
                <div key={index} className={`grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 ${index === 0 ? 'pt-0' : ''}`}>
                  
                  {/* Slider Preview image */}
                  <div className="lg:col-span-1 space-y-3">
                    <div className="h-48 bg-stone-950 border border-stone-800 rounded overflow-hidden flex items-center justify-center relative text-stone-600">
                      {slider.imageUrl ? (
                        <img src={slider.imageUrl} alt={slider.title} className="object-cover w-full h-full" />
                      ) : (
                        <ImageIcon className="h-8 w-8" />
                      )}
                      <div className="absolute top-2 right-2 bg-stone-950/80 backdrop-blur-sm border border-stone-800 px-2 py-0.5 rounded text-[8px] font-extrabold text-amber-300 uppercase tracking-widest font-mono">
                        Slide {index + 1}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRemoveSlider(index)}
                        className="w-full flex items-center justify-center gap-1 bg-stone-950 hover:bg-red-950/20 border border-stone-800 hover:border-red-900/30 text-stone-400 hover:text-red-400 text-[9px] font-extrabold uppercase tracking-wider py-2 px-3 rounded-md transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove Slide
                      </button>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Slide Headline Title *</label>
                      <input
                        required
                        type="text"
                        value={slider.title}
                        onChange={(e) => handleUpdateSlider(index, 'title', e.target.value)}
                        placeholder="e.g. LUXURY BACKLIT SMART MIRRORS"
                        className="bg-stone-950 border border-stone-800 rounded p-2.5 text-xs text-stone-200 focus:border-amber-500 outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Slide Subtitle description *</label>
                      <input
                        required
                        type="text"
                        value={slider.subtitle}
                        onChange={(e) => handleUpdateSlider(index, 'subtitle', e.target.value)}
                        placeholder="e.g. Transform your bedroom with warm smart sensor LEDs."
                        className="bg-stone-950 border border-stone-800 rounded p-2.5 text-xs text-stone-300 focus:border-amber-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Action Button Text *</label>
                        <input
                          required
                          type="text"
                          value={slider.btnText}
                          onChange={(e) => handleUpdateSlider(index, 'btnText', e.target.value)}
                          placeholder="e.g. DISCOVER CATALOG"
                          className="bg-stone-950 border border-stone-800 rounded p-2.5 text-xs text-stone-200 focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Button Redirection URL *</label>
                        <input
                          required
                          type="text"
                          value={slider.btnLink}
                          onChange={(e) => handleUpdateSlider(index, 'btnLink', e.target.value)}
                          placeholder="e.g. /collections/led-mirrors"
                          className="bg-stone-950 border border-stone-800 rounded p-2.5 text-xs text-stone-200 focus:border-amber-500 outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <FileUpload
                        value={slider.imageUrl}
                        onChange={(url) => handleUpdateSlider(index, 'imageUrl', url)}
                        folder="mirrorwala/banners"
                        label="Slide Graphic Image *"
                        multiple={false}
                      />
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* TESTIMONIALS REVIEWS PANEL */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center select-none border-b border-stone-850 pb-4">
              <span className="text-[10px] uppercase font-black tracking-widest text-stone-400">Showroom Client Reviews</span>
              <button
                onClick={handleAddTestimonial}
                className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-amber-300 hover:text-white transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> Add testimonial
              </button>
            </div>

            <div className="space-y-6 divide-y divide-stone-850/60">
              {cmsData.testimonials.map((test, index) => (
                <div key={index} className={`grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 ${index === 0 ? 'pt-0' : ''}`}>
                  
                  {/* Name and Designation */}
                  <div className="md:col-span-1 space-y-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold font-sans">Reviewer Name *</label>
                      <input
                        required
                        type="text"
                        value={test.name}
                        onChange={(e) => handleUpdateTestimonial(index, 'name', e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="bg-stone-950 border border-stone-800 rounded p-2.5 text-xs text-stone-250 focus:border-amber-500 outline-none font-serif font-bold text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Designation & Location *</label>
                      <input
                        required
                        type="text"
                        value={test.role}
                        onChange={(e) => handleUpdateTestimonial(index, 'role', e.target.value)}
                        placeholder="e.g. Architect, Bangalore"
                        className="bg-stone-950 border border-stone-800 rounded p-2.5 text-xs text-stone-300 focus:border-amber-500 outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 pt-1">
                      <FileUpload
                        value={test.avatarUrl || ''}
                        onChange={(url) => handleUpdateTestimonial(index, 'avatarUrl', url)}
                        folder="mirrorwala/testimonials"
                        label="Reviewer Profile Photo"
                        multiple={false}
                      />
                    </div>
                  </div>

                  {/* Feedback quote content */}
                  <div className="md:col-span-3 space-y-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center select-none">
                        <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Client Quote Feedback Text *</label>
                        <div className="flex items-center gap-1.5 bg-stone-950 border border-stone-800 px-2 py-0.5 rounded text-xs text-amber-300 font-mono font-bold">
                          <Star className="h-3 w-3 fill-amber-300" /> 
                          <select
                            value={test.rating}
                            onChange={(e) => handleUpdateTestimonial(index, 'rating', parseInt(e.target.value))}
                            className="bg-transparent border-none text-[10px] text-amber-300 outline-none font-bold cursor-pointer"
                          >
                            <option value="5" className="bg-stone-950 text-white">5 Stars</option>
                            <option value="4" className="bg-stone-950 text-white">4 Stars</option>
                            <option value="3" className="bg-stone-950 text-white">3 Stars</option>
                          </select>
                        </div>
                      </div>
                      <textarea
                        required
                        rows={3}
                        value={test.quote}
                        onChange={(e) => handleUpdateTestimonial(index, 'quote', e.target.value)}
                        placeholder="Enter the testimonial detail pitch description..."
                        className="bg-stone-950 border border-stone-800 rounded p-2.5 text-xs text-stone-300 focus:border-amber-500 outline-none resize-none"
                      />
                    </div>

                    <div className="flex justify-end select-none">
                      <button
                        onClick={() => handleRemoveTestimonial(index)}
                        className="flex items-center gap-1 bg-stone-950 hover:bg-red-950/20 border border-stone-850 hover:border-red-900/30 text-stone-400 hover:text-red-400 text-[9px] font-extrabold uppercase tracking-wider py-1.5 px-3.5 rounded transition-all cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete Review
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROMOTION ALERTS PANEL */}
        {activeTab === 'promo' && (
          <div className="space-y-5">
            <span className="text-[10px] uppercase font-black tracking-widest text-stone-400 block border-b border-stone-850 pb-4">
              Announcement alerts configurations
            </span>

            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Active Coupon Notice Alert Text</label>
              <input
                type="text"
                value={cmsData.promoText}
                onChange={(e) => setCmsData(prev => ({ ...prev, promoText: e.target.value }))}
                placeholder="e.g. SUMMER VIBES: GET FLAT 10% OFF USING VOUCHER CODE GLAM10 AT CHECKOUT"
                className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-250 focus:border-amber-500 outline-none"
              />
              <p className="text-[10px] text-stone-500">Displayed in standard customer promo rows or banner carousels.</p>
            </div>

            <div className="border border-stone-850/80 bg-stone-950/40 rounded p-4 space-y-4">
              <div className="flex items-center gap-2 select-none">
                <input
                  type="checkbox"
                  id="announcementActive"
                  checked={cmsData.announcementActive}
                  onChange={(e) => setCmsData(prev => ({ ...prev, announcementActive: e.target.checked }))}
                  className="rounded border-stone-800 bg-stone-950 text-amber-500 focus:ring-amber-500 h-4 w-4 cursor-pointer"
                />
                <label htmlFor="announcementActive" className="text-[10px] uppercase tracking-wider text-stone-400 font-extrabold cursor-pointer">
                  Activate announcement ticker bar (Header overlay)
                </label>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Ticker Notification Alert Text</label>
                <input
                  type="text"
                  disabled={!cmsData.announcementActive}
                  value={cmsData.announcementText}
                  onChange={(e) => setCmsData(prev => ({ ...prev, announcementText: e.target.value }))}
                  placeholder="e.g. FREE SHIPPING ON ALL CUSTOM MIRROR SHIPMENTS!"
                  className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-250 focus:border-amber-500 outline-none disabled:opacity-40 font-bold text-amber-300"
                />
                <p className="text-[10px] text-stone-500">Fixed announcement bar at the very top of the website.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
