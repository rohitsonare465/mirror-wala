'use client';

import React, { useState } from 'react';
import { 
  Save, 
  Globe, 
  Search, 
  FileCode, 
  RefreshCw, 
  Sparkles, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { updateSeoMetadataAction, regenerateSitemapXMLAction } from '@/actions/admin';
import { useRouter } from 'next/navigation';

interface SeoData {
  title: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string | null;
  sitemapPriority: number;
}

interface SeoClientProps {
  initialGlobalSeo: any;
  initialHomeSeo: any;
}

export default function SeoClient({ initialGlobalSeo, initialHomeSeo }: SeoClientProps) {
  const router = useRouter();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'global' | 'home' | 'sitemap'>('global');
  const [isSaving, setIsSaving] = useState(false);
  const [isBuildingSitemap, setIsBuildingSitemap] = useState(false);
  const [sitemapPreview, setSitemapPreview] = useState<string | null>(null);

  // Cast initial records or use premium luxury defaults
  const [globalSeo, setGlobalSeo] = useState<SeoData>(() => {
    const defaultData: SeoData = {
      title: 'Mirrorwala | Premium LED Backlit & Custom Designer Mirrors',
      metaDescription: 'Shop India\'s finest collection of smart touch LED mirrors, customized backlit vanities, and organic shape designer wall mirrors. Free transit insured shipping.',
      keywords: ['LED Mirrors', 'Smart Bathroom Mirrors', 'Custom Backlit Mirrors', 'Designer Wall Mirrors', 'Mirrorwala'],
      canonicalUrl: 'https://mirrorwala.com',
      sitemapPriority: 1.0,
    };
    if (initialGlobalSeo) {
      return {
        title: initialGlobalSeo.title || defaultData.title,
        metaDescription: initialGlobalSeo.metaDescription || defaultData.metaDescription,
        keywords: Array.isArray(initialGlobalSeo.keywords) ? initialGlobalSeo.keywords : defaultData.keywords,
        canonicalUrl: initialGlobalSeo.canonicalUrl || defaultData.canonicalUrl,
        sitemapPriority: typeof initialGlobalSeo.sitemapPriority === 'number' ? initialGlobalSeo.sitemapPriority : defaultData.sitemapPriority,
      };
    }
    return defaultData;
  });

  const [homeSeo, setHomeSeo] = useState<SeoData>(() => {
    const defaultData: SeoData = {
      title: 'Buy LED Smart Mirrors Online - Mirrorwala Showroom',
      metaDescription: 'Browse luxurious premium custom shape backlit bathroom mirrors, organic accents, and designer touch-sensor configurations at Mirrorwala India.',
      keywords: ['Buy LED Mirrors', 'Custom Shape Vanity', 'Dimmable Bathroom Mirrors', 'Backlit Vanity India'],
      canonicalUrl: 'https://mirrorwala.com',
      sitemapPriority: 0.9,
    };
    if (initialHomeSeo) {
      return {
        title: initialHomeSeo.title || defaultData.title,
        metaDescription: initialHomeSeo.metaDescription || defaultData.metaDescription,
        keywords: Array.isArray(initialHomeSeo.keywords) ? initialHomeSeo.keywords : defaultData.keywords,
        canonicalUrl: initialHomeSeo.canonicalUrl || defaultData.canonicalUrl,
        sitemapPriority: typeof initialHomeSeo.sitemapPriority === 'number' ? initialHomeSeo.sitemapPriority : defaultData.sitemapPriority,
      };
    }
    return defaultData;
  });

  const [globalKeywordsStr, setGlobalKeywordsStr] = useState(() => globalSeo.keywords.join(', '));
  const [homeKeywordsStr, setHomeKeywordsStr] = useState(() => homeSeo.keywords.join(', '));

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const key = activeTab === 'global' ? 'global' : 'home';
    const seoState = activeTab === 'global' ? globalSeo : homeSeo;
    const keywordsStr = activeTab === 'global' ? globalKeywordsStr : homeKeywordsStr;

    try {
      if (seoState.title.length > 70) {
        throw new Error('Meta title must be under 70 characters.');
      }
      if (seoState.metaDescription.length > 160) {
        throw new Error('Meta description must be under 160 characters.');
      }

      const parsedKeywords = keywordsStr
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);

      const payload = {
        title: seoState.title.trim(),
        metaDescription: seoState.metaDescription.trim(),
        keywords: parsedKeywords,
        canonicalUrl: seoState.canonicalUrl?.trim() || null,
        sitemapPriority: seoState.sitemapPriority,
      };

      await updateSeoMetadataAction(key, payload);
      toast.success(
        `SEO parameters for ${key === 'global' ? 'Global Brand' : 'Homepage Landing'} successfully saved in DB.`,
        'SEO Settings Saved'
      );
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed. Please verify form values.', 'SEO Error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerateSitemap = async () => {
    setIsBuildingSitemap(true);
    setSitemapPreview(null);
    try {
      const xml = await regenerateSitemapXMLAction();
      setSitemapPreview(xml);
      toast.success('Successfully compiled dynamic sitemap structure based on products catalog.', 'Sitemap Rebuilt');
    } catch (err: any) {
      toast.error(err.message || 'Failed to rebuild sitemap.', 'Sitemap Error');
    } finally {
      setIsBuildingSitemap(false);
    }
  };

  const handleDraftAIAssist = () => {
    if (activeTab === 'global') {
      setGlobalSeo(prev => ({
        ...prev,
        title: 'Mirrorwala™ | Premium Smart Touch Backlit & Custom LED Mirrors',
        metaDescription: 'Explore India\'s premier brand for designer smart vanity mirrors, custom backlit organic layouts, and full-length dressing accents. Transit insurance covered.',
      }));
      setGlobalKeywordsStr('LED Vanity Mirrors, Smart Bathroom Mirrors, Backlit LED India, Luxury Wall Mirror, Custom Glass Work');
    } else {
      setHomeSeo(prev => ({
        ...prev,
        title: 'Premium Dimmable LED Bathroom Vanity Mirrors | Mirrorwala India',
        metaDescription: 'Shop customized sensor-backlit mirrors, organic designer frames, and high-fidelity smart touch options handcrafted to perfection at Mirrorwala.',
      }));
      setHomeKeywordsStr('Backlit Bathroom Mirror, Dimmable Vanity Glass, Smart Touch Sensor Mirror, Luxury Home Decor');
    }
    toast.info('Drafted premium SEO titles and descriptions. Please click Save to submit.', 'AI Draft Assisted');
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Controls header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-amber-300 font-extrabold font-sans">Search Visibility</span>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">SEO & Metadata Manager</h1>
          <p className="text-xs text-stone-400 mt-0.5">Control search keywords, meta descriptions, canonical URLs, and compile dynamic XML sitemaps.</p>
        </div>
        {activeTab !== 'sitemap' && (
          <button
            onClick={handleSaveSeo}
            disabled={isSaving}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-extrabold uppercase tracking-widest text-[10px] py-3.5 px-6 rounded-md hover:from-white hover:to-amber-200 transition-all duration-300 cursor-pointer shadow-lg shadow-amber-400/5"
          >
            {isSaving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save SEO Meta Configuration
          </button>
        )}
      </div>

      {/* Tab selection */}
      <div className="flex border-b border-stone-850 select-none">
        <button
          onClick={() => setActiveTab('global')}
          className={`flex items-center gap-2 px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-widest border-b-2 transition-all duration-300 cursor-pointer ${
            activeTab === 'global' 
              ? 'border-amber-400 text-amber-300' 
              : 'border-transparent text-stone-400 hover:text-white'
          }`}
        >
          <Globe className="h-4 w-4" /> Global Brand SEO
        </button>
        <button
          onClick={() => setActiveTab('home')}
          className={`flex items-center gap-2 px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-widest border-b-2 transition-all duration-300 cursor-pointer ${
            activeTab === 'home' 
              ? 'border-amber-400 text-amber-300' 
              : 'border-transparent text-stone-400 hover:text-white'
          }`}
        >
          <Search className="h-4 w-4" /> Homepage Landing SEO
        </button>
        <button
          onClick={() => setActiveTab('sitemap')}
          className={`flex items-center gap-2 px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-widest border-b-2 transition-all duration-300 cursor-pointer ${
            activeTab === 'sitemap' 
              ? 'border-amber-400 text-amber-300' 
              : 'border-transparent text-stone-400 hover:text-white'
          }`}
        >
          <FileCode className="h-4 w-4" /> XML Sitemap Builder
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-stone-900 border border-stone-850 p-6 rounded-md shadow-xl">
        
        {/* EDIT FORMS */}
        {activeTab !== 'sitemap' && (
          <form onSubmit={handleSaveSeo} className="space-y-5">
            
            <div className="flex justify-between items-center select-none border-b border-stone-850 pb-4">
              <span className="text-[10px] uppercase font-black tracking-widest text-stone-400">
                {activeTab === 'global' ? 'Global Brand Index Specifications' : 'Homepage Landing Specs'}
              </span>
              <button
                type="button"
                onClick={handleDraftAIAssist}
                className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-amber-300 hover:text-white transition-colors cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" /> AI Draft Assistant
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center select-none">
                <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Meta Index Title Tag *</label>
                <span className={`text-[10px] font-mono ${
                  (activeTab === 'global' ? globalSeo.title.length : homeSeo.title.length) > 70 
                    ? 'text-red-400 font-bold' 
                    : 'text-stone-550'
                }`}>
                  {activeTab === 'global' ? globalSeo.title.length : homeSeo.title.length} / 70 chars limit
                </span>
              </div>
              <input
                required
                type="text"
                value={activeTab === 'global' ? globalSeo.title : homeSeo.title}
                onChange={(e) => {
                  const val = e.target.value;
                  if (activeTab === 'global') {
                    setGlobalSeo(prev => ({ ...prev, title: val }));
                  } else {
                    setHomeSeo(prev => ({ ...prev, title: val }));
                  }
                }}
                placeholder="e.g. Mirrorwala | Premium Backlit LED Vanity & Designer Mirrors"
                className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none font-serif font-bold text-white tracking-wide"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center select-none">
                <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Meta Pitch Description *</label>
                <span className={`text-[10px] font-mono ${
                  (activeTab === 'global' ? globalSeo.metaDescription.length : homeSeo.metaDescription.length) > 160 
                    ? 'text-red-400 font-bold' 
                    : 'text-stone-550'
                }`}>
                  {activeTab === 'global' ? globalSeo.metaDescription.length : homeSeo.metaDescription.length} / 160 chars limit
                </span>
              </div>
              <textarea
                required
                rows={4}
                value={activeTab === 'global' ? globalSeo.metaDescription : homeSeo.metaDescription}
                onChange={(e) => {
                  const val = e.target.value;
                  if (activeTab === 'global') {
                    setGlobalSeo(prev => ({ ...prev, metaDescription: val }));
                  } else {
                    setHomeSeo(prev => ({ ...prev, metaDescription: val }));
                  }
                }}
                placeholder="Shop dynamic luxury backlit smart mirrors customized perfectly to your home requirements. Built with premium touch-sensor dimmers..."
                className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-300 focus:border-amber-500 outline-none resize-none leading-relaxed font-sans"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Focus Search Keywords (separated by comma)</label>
              <input
                type="text"
                value={activeTab === 'global' ? globalKeywordsStr : homeKeywordsStr}
                onChange={(e) => {
                  const val = e.target.value;
                  if (activeTab === 'global') {
                    setGlobalKeywordsStr(val);
                  } else {
                    setHomeKeywordsStr(val);
                  }
                }}
                placeholder="LED Mirrors, smart touch sensors, custom shapes vanity, bathroom decor"
                className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Canonical URL Address</label>
                <input
                  type="text"
                  value={(activeTab === 'global' ? globalSeo.canonicalUrl : homeSeo.canonicalUrl) || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (activeTab === 'global') {
                      setGlobalSeo(prev => ({ ...prev, canonicalUrl: val || null }));
                    } else {
                      setHomeSeo(prev => ({ ...prev, canonicalUrl: val || null }));
                    }
                  }}
                  placeholder="e.g. https://mirrorwala.com"
                  className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-350 focus:border-amber-500 outline-none font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between select-none">
                  <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Sitemap Crawling Priority</label>
                  <span className="text-[10px] font-mono text-amber-300 font-bold">
                    {(activeTab === 'global' ? globalSeo.sitemapPriority : homeSeo.sitemapPriority).toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center gap-4 h-11">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={activeTab === 'global' ? globalSeo.sitemapPriority : homeSeo.sitemapPriority}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (activeTab === 'global') {
                        setGlobalSeo(prev => ({ ...prev, sitemapPriority: val }));
                      } else {
                        setHomeSeo(prev => ({ ...prev, sitemapPriority: val }));
                      }
                    }}
                    className="flex-1 accent-amber-300 h-1.5 bg-stone-950 rounded-lg cursor-pointer appearance-none"
                  />
                  <span title="Values closer to 1 indicate higher indexing priority relative to other internal paths">
                    <HelpCircle className="h-4 w-4 text-stone-500" />
                  </span>
                </div>
              </div>
            </div>

          </form>
        )}

        {/* XML SITEMAP GENERATOR */}
        {activeTab === 'sitemap' && (
          <div className="space-y-6">
            <span className="text-[10px] uppercase font-black tracking-widest text-stone-400 block border-b border-stone-850 pb-4">
              Dynamic XML Sitemap Builder
            </span>

            <div className="flex flex-col sm:flex-row gap-5 items-start bg-stone-950 border border-stone-850 p-5 rounded-md">
              <div className="flex-1 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">Catalog Sitemap Indexer</span>
                <p className="text-xs text-stone-400 leading-relaxed font-sans mt-1">
                  Click below to scan all active collections, product tags, design URLs and compile the dynamic sitemap configuration file on the web server. This helps Google, Yahoo and Bing indexes crawl your new catalog collections instantly.
                </p>
              </div>

              <button
                onClick={handleRegenerateSitemap}
                disabled={isBuildingSitemap}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-extrabold uppercase tracking-widest text-[9px] py-3.5 px-6 rounded hover:from-white hover:to-amber-200 disabled:opacity-50 transition-all duration-300 cursor-pointer whitespace-nowrap shadow shadow-amber-400/5 select-none"
              >
                {isBuildingSitemap ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Compiling...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-3.5 w-3.5" /> Rebuild Sitemap XML
                  </>
                )}
              </button>
            </div>

            {/* Sitemap Preview Box */}
            {sitemapPreview && (
              <div className="space-y-2 animate-fade-in font-mono text-xs">
                <div className="flex justify-between items-center select-none text-[9px] uppercase tracking-wider text-stone-550">
                  <span>compiled sitemap.xml Preview</span>
                  <span>{sitemapPreview.split('<url>').length - 1} indexed URLs</span>
                </div>
                <div className="bg-stone-950 border border-stone-850 rounded p-4 overflow-x-auto max-h-80 overflow-y-auto text-stone-400 whitespace-pre scrollbar-thin select-all">
                  {sitemapPreview}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
