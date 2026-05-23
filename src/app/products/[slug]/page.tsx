'use client';

import React, { useState, useEffect } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import CloudinaryImage from '@/components/common/CloudinaryImage';
import ProductSchema from '@/components/seo/ProductSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { motion } from 'framer-motion';
import { Sparkles, Heart, ShoppingBag, ShieldCheck, Truck, RefreshCw, Star, Info, MessageSquareCode } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Analytics } from '@/lib/analytics';
import { useCartStore } from '@/store/useCartStore';

// Static luxury mock data matching core database catalog
const PRODUCTS_REGISTRY: Record<string, any> = {
  'galaxy-mosaic-art-mirror': {
    id: '65dfac12e345b123456789ab',
    name: 'Galaxy Mosaic Art Mirror',
    slug: 'galaxy-mosaic-art-mirror',
    sku: 'MW-ART-GALAXY-01',
    price: 34000,
    salePrice: 29999,
    description: 'A masterpiece of stained glass art. The Galaxy Mosaic Mirror features a premium matte black silhouette frame adorned with hand-fused red, blue, and purple stained-glass accents. A mesmerizing focal point that transforms any space into an luxury interior showroom.',
    images: ['/images/artistic_black.jpg', '/images/before_room.png'],
    categoryName: 'Art Mirrors',
    stock: 5,
    LEDType: 'NONE',
    frameMaterial: 'Artisanal Hand-Fused Stained Glass & Matte Black Powder Coated Aluminum Frame',
    dimensions: '700mm x 1200mm x 6mm',
  },
  'luxury-led-crystal-mirror': {
    id: '65dfac22e345b123456789cd',
    name: 'Luxury LED Crystal Mirror',
    slug: 'luxury-led-crystal-mirror',
    sku: 'MW-LED-CRYSTAL-02',
    price: 48000,
    salePrice: 42500,
    description: 'The ultimate luxury statement piece. Featuring a spectacular irregular wavy profile lined with premium precision-cut crystal glass facets that reflect and amplify the integrated high-lumen dual-glow smart LED strip. Elevates your bathroom or designer dressing suite.',
    images: ['/images/crystal_wavy.jpg', '/images/after_room.png'],
    categoryName: 'LED Mirrors',
    stock: 7,
    LEDType: 'High-CRI Sandblasted Ambient Dual-glow (3000K-6000K) with Smart Touch Dimmer',
    frameMaterial: 'Anodized Champagne Gold Base Shield with Luxury Faceted Crystal Border',
    dimensions: '750mm x 1050mm x 5mm',
  },
  'designer-gold-frame-mirror': {
    id: '65dfac32e345b123456789ef',
    name: 'Designer Gold Frame Mirror',
    slug: 'designer-gold-frame-mirror',
    sku: 'MW-DSN-GOLD-03',
    price: 42000,
    salePrice: 38000,
    description: 'Unparalleled organic form meets luxury baroque finishing. This irregular handcrafted masterpiece is finished in brilliant champagne gold leaf paint, offering a rich warm glow to any hallway or luxury living room fireplace.',
    images: ['/images/designer_category.png', '/images/before_room.png'],
    categoryName: 'Designer Mirrors',
    stock: 8,
    LEDType: 'NONE',
    frameMaterial: 'Handcrafted Organic Polystyrene Frame in Champagne Gold Leaf Finish',
    dimensions: '800mm x 1100mm x 6mm',
  },
  'aura-smart-led-bulb-mirror': {
    id: '65dfac42e345b12345678901',
    name: 'Aura Smart LED Bulb Mirror',
    slug: 'aura-smart-led-bulb-mirror',
    sku: 'MW-LED-AURA-04',
    price: 24000,
    salePrice: 19999,
    description: 'Playful silhouette meets smart engineering. Shaping a gorgeous lightbulb outline with high-lumen sandblasted LED dual-glow channels. Outfitted with touch sensor controls and a built-in demister. A stunning novelty statement for chic powder rooms.',
    images: ['/images/lightbulb_led.jpg', '/images/after_room.png'],
    categoryName: 'Bathroom Mirrors',
    stock: 12,
    LEDType: 'Tri-Color Dimmable Premium LED (3000K / 4000K / 6000K)',
    frameMaterial: 'Ultra-slim Anodized Space Gray Metal Frame Shield',
    dimensions: '650mm x 900mm x 5mm',
  },
  'designer-green-organic-mirror': {
    id: '65dfac52e345b12345678923',
    name: 'Designer Green Organic Mirror',
    slug: 'designer-green-organic-mirror',
    sku: 'MW-CST-GREEN-05',
    price: 28000,
    salePrice: 24500,
    description: "Celebrate nature's fluidity with this abstract organic leaf-shaped design. The frame is finished in a vibrant custom forest green high-gloss enamel, bringing natural luxury showroom vibes to elegant living spaces and cozy alcoves.",
    images: ['/images/green_organic.jpg', '/images/before_room.png'],
    categoryName: 'Custom Mirrors',
    stock: 10,
    LEDType: 'NONE',
    frameMaterial: 'Vibrant Glossy Forest Green Hand-Painted Wood Frame',
    dimensions: '600mm x 1250mm x 6mm',
  },
  'floral-engraved-modern-mirror': {
    id: '65dfac62e345b12345678945',
    name: 'Floral Engraved Modern Mirror',
    slug: 'floral-engraved-modern-mirror',
    sku: 'MW-LUX-FLORAL-06',
    price: 36000,
    salePrice: 32000,
    description: 'A breathtaking blend of classic engraving and contemporary glass art. Features delicate custom-etched floral and organic details around a clean modern minimalist design. Adds unmatched architectural sophistication to premium showrooms and bedrooms.',
    images: ['/images/floral_engraved.jpg', '/images/after_room.png', '/images/before_room.png'],
    categoryName: 'Luxury Mirrors',
    stock: 6,
    LEDType: 'NONE',
    frameMaterial: 'Frameless Diamond-Engraved Polished Crystal Edge',
    dimensions: '800mm x 1000mm x 5mm',
  }
};

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = (params?.slug as string) || 'galaxy-mosaic-art-mirror';
  
  // Resolve product or fallback to galaxy-mosaic-art-mirror
  const product = PRODUCTS_REGISTRY[slug] || PRODUCTS_REGISTRY['galaxy-mosaic-art-mirror'];
  
  // Customize options states
  const [selectedSize, setSelectedSize] = useState('Standard (600x800mm)');
  const [ledSetting, setLedSetting] = useState(product.LEDType !== 'NONE' ? 'Tri-color' : 'NONE');
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const [activeImage, setActiveImage] = useState(product.images[0]);

  const addItem = useCartStore((state) => state.addItem);

  // Sync active image if slug changes
  useEffect(() => {
    if (product) {
      setActiveImage(product.images[0]);
    }
  }, [product]);

  // Analytics event tracking on mount
  useEffect(() => {
    if (product) {
      Analytics.trackProductClick({
        id: product.id,
        name: product.name,
        price: product.salePrice ?? product.price,
        category: product.categoryName,
        sku: product.sku
      });
    }
  }, [product]);

  // Dynamic pricing updates based on sizing selection (+4000 for premium large size)
  const isPremiumSize = selectedSize.includes('Premium Grand') || selectedSize.includes('800x1200mm') || selectedSize.includes('Grand');
  const sizePremium = isPremiumSize ? 4000 : 0;
  
  const basePrice = product.price + sizePremium;
  const baseSalePrice = product.salePrice ? product.salePrice + sizePremium : null;
  const finalUnitPrice = baseSalePrice ?? basePrice;

  // Build the unified cart item payload
  const getCartItemPayload = () => {
    return {
      id: `${product.id}-${selectedSize.replace(/\s+/g, '-')}-${ledSetting}`,
      productId: product.id,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription || null,
        basePrice: product.price,
        categoryId: '65dfac02e345b123456789a1',
        images: product.images,
        variants: [],
        customizable: true,
        allowedShapes: [],
        allowedLedColors: [],
        allowedEdges: [],
        allowedFeatures: [],
        isFeatured: product.featured || false,
        isNew: true,
        seoTitle: null,
        seoDescription: null,
        seoKeywords: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        sku: product.sku,
        categoryName: product.categoryName
      },
      variantId: null,
      variant: null,
      customization: {
        ledColor: ledSetting,
        shape: product.name.includes('Organic') || product.name.includes('Asymmetric') ? 'ORGANIC' : 'RECTANGULAR',
        edgeStyle: 'BEVELED',
        features: [selectedSize]
      },
      quantity: quantity,
      unitPrice: finalUnitPrice
    };
  };

  const handleAddToCart = () => {
    // Add to cart track call
    Analytics.trackAddToCart({
      id: product.id,
      name: product.name,
      price: finalUnitPrice,
      category: product.categoryName,
      sku: product.sku
    }, quantity);
    
    // Add to Zustand cart store
    addItem(getCartItemPayload());
    
    // Redirect to cart
    router.push('/cart');
  };

  const handleBuyNow = () => {
    // Track Buy Now
    Analytics.trackAddToCart({
      id: product.id,
      name: product.name,
      price: finalUnitPrice,
      category: product.categoryName,
      sku: product.sku
    }, quantity);

    // Add item to Zustand store
    addItem(getCartItemPayload());

    // Redirect straight to Checkout
    router.push('/checkout');
  };

  const handleWhatsAppOrder = () => {
    const textMessage = `Hello Mirrorwala, I want to order the "${product.name}" in size: ${selectedSize} and LED glow: ${ledSetting}. Please share billing details.`;
    const whatsappUrl = `https://wa.me/919826258430?text=${encodeURIComponent(textMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <PublicLayout>
      {/* Dynamic SEO Rich snippets schemas */}
      <ProductSchema product={product} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Collections', url: '/collections' },
          { name: product.categoryName, url: `/collections?style=${slug}` },
          { name: product.name, url: `/products/${slug}` },
        ]}
      />

      <section className="bg-stone-950 py-12 md:py-20 font-sans text-stone-200">
        <div className="container mx-auto px-4 md:px-8">
          
          {/* Main Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Left Column: Premium Interactive Showroom Media Viewer */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-square w-full rounded bg-stone-900 border border-stone-850 overflow-hidden shadow-2xl">
                <CloudinaryImage
                  src={activeImage}
                  alt={product.name}
                  fill
                  priority={true}
                  className="object-cover"
                />
              </div>

              {/* Thumbnails list */}
              <div className="flex items-center gap-4">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 rounded border overflow-hidden transition-all duration-300 ${
                      activeImage === img ? 'border-amber-400 scale-95 shadow' : 'border-stone-800 hover:border-amber-550'
                    }`}
                  >
                    <CloudinaryImage src={img} alt={`${product.name} Preview`} fill sizes="80px" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Custom Option Configurations Selection */}
            <div className="flex flex-col gap-6 lg:py-2">
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-widest text-amber-300 font-bold flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> Premium Showroom Authentic
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                  {product.name}
                </h1>
                
                {/* Review ratings mockup */}
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-stone-400 font-bold">(48 Editorial Reviews)</span>
                </div>
              </div>

              {/* Pricing section */}
              <div className="flex items-baseline gap-3 py-3 border-y border-stone-850/60">
                {baseSalePrice ? (
                  <>
                    <span className="font-serif text-3xl font-extrabold text-amber-200">
                      ₹{baseSalePrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-stone-500 line-through text-sm">
                      ₹{basePrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-green-500 uppercase tracking-widest font-extrabold bg-green-950/20 border border-green-950 px-1.5 py-0.5 rounded ml-2">
                      Save ₹{(basePrice - baseSalePrice).toLocaleString('en-IN')}
                    </span>
                  </>
                ) : (
                  <span className="font-serif text-3xl font-extrabold text-amber-200">
                    ₹{basePrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {/* Product description */}
              <p className="text-sm text-stone-400 leading-relaxed">
                {product.description}
              </p>

              {/* Dynamic size customized configuration selector */}
              <div className="flex flex-col gap-3">
                <span className="text-xs uppercase tracking-wider font-extrabold text-stone-300">
                  Select Dimension Sizing:
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {['Standard (600x800mm)', 'Premium Grand (800x1200mm)'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`text-xs uppercase tracking-widest font-bold py-3 px-2 text-center rounded border transition-all duration-300 ${
                        selectedSize === size
                          ? 'border-amber-400 bg-amber-500/5 text-amber-200 font-extrabold'
                          : 'border-stone-850 bg-stone-900/40 text-stone-400 hover:border-amber-500/20 hover:text-stone-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* LED illuminator touch controls mockup (if LED smart mirror) */}
              {product.LEDType !== 'NONE' && (
                <div className="flex flex-col gap-3">
                  <span className="text-xs uppercase tracking-wider font-extrabold text-stone-300">
                    Integrated LED Glow Color:
                  </span>
                  <div className="flex items-center gap-3">
                    {['Tri-color', 'Warm Ambient', 'Natural White'].map((glow) => (
                      <button
                        key={glow}
                        onClick={() => setLedSetting(glow)}
                        className={`text-xs uppercase tracking-widest font-bold py-2 px-4 rounded border transition-all duration-300 ${
                          ledSetting === glow
                            ? 'border-amber-400 bg-amber-500/5 text-amber-200 font-extrabold'
                            : 'border-stone-850 bg-stone-900/40 text-stone-400 hover:border-amber-500/20 hover:text-stone-200'
                        }`}
                      >
                        {glow}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons (Quantity, Cart, Buy Now, WhatsApp, Wishlist) */}
              <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-stone-850/60">
                <div className="flex items-center gap-4">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-stone-800 rounded bg-stone-900">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2.5 text-stone-400 hover:text-amber-200 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold text-stone-200 px-2 w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2.5 text-stone-400 hover:text-amber-200 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to cart */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 border border-stone-800 hover:border-amber-550 text-stone-300 hover:text-white font-extrabold uppercase tracking-widest text-xs py-3.5 px-6 rounded transition-all duration-300 cursor-pointer"
                  >
                    <ShoppingBag className="h-4 w-4" /> Add to Cart
                  </button>

                  {/* Heart wishlist */}
                  <button
                    onClick={() => setIsWishlist(!isWishlist)}
                    className={`p-3.5 rounded border border-stone-800 hover:border-amber-500/20 transition-all duration-300 ${
                      isWishlist ? 'text-red-500 border-red-500/20 bg-red-950/10' : 'text-stone-400'
                    }`}
                  >
                    <Heart className="h-5 w-5 fill-current" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Buy Now Button */}
                  <button
                    onClick={handleBuyNow}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-extrabold uppercase tracking-widest text-xs py-3.5 px-6 rounded hover:from-white hover:to-amber-200 transition-all duration-300 shadow shadow-amber-400/10 cursor-pointer"
                  >
                    Buy Now
                  </button>

                  {/* WhatsApp Order Button */}
                  <button
                    onClick={handleWhatsAppOrder}
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold uppercase tracking-widest text-xs py-3.5 px-6 rounded transition-all duration-300 shadow cursor-pointer"
                  >
                    <MessageSquareCode className="h-4 w-4" /> WhatsApp Order
                  </button>
                </div>

                {/* Direct Bespoke Quotation CTA if customization is preferred */}
                <div className="mt-2 text-center p-3 rounded border border-amber-500/10 bg-amber-500/5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-left">
                    <Info className="h-4.5 w-4.5 text-amber-300 flex-shrink-0" />
                    <span className="text-[11px] text-stone-400 font-sans">
                      Need custom dimensions, dynamic shapes or custom LED add-ons?
                    </span>
                  </div>
                  <Link
                    href="/custom-mirrors"
                    className="text-[10px] uppercase tracking-widest font-extrabold text-amber-300 hover:text-white transition-colors"
                  >
                    Bespoke Quote
                  </Link>
                </div>
              </div>

              {/* Delivery and Atelier details */}
              <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                <div className="flex flex-col items-center gap-1.5 p-3 rounded bg-stone-900/30 border border-stone-850">
                  <Truck className="h-5 w-5 text-amber-300" />
                  <span className="text-[9px] uppercase tracking-widest font-bold text-stone-300">Free Shipping</span>
                  <span className="text-[8px] text-stone-500 font-sans">Indore Ateliers</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-3 rounded bg-stone-900/30 border border-stone-850">
                  <ShieldCheck className="h-5 w-5 text-amber-300" />
                  <span className="text-[9px] uppercase tracking-widest font-bold text-stone-300">3-Year Shield</span>
                  <span className="text-[8px] text-stone-500 font-sans">LEDs/Electronic parts</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-3 rounded bg-stone-900/30 border border-stone-850">
                  <RefreshCw className="h-5 w-5 text-amber-300" />
                  <span className="text-[9px] uppercase tracking-widest font-bold text-stone-300">Transit Guarantee</span>
                  <span className="text-[8px] text-stone-500 font-sans">100% Replacement</span>
                </div>
              </div>

            </div>

          </div>

          {/* Luxury Atelier Specifications details */}
          <div className="mt-16 pt-12 border-t border-stone-850/60 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            <div className="flex flex-col gap-4">
              <h3 className="font-serif text-2xl font-bold text-white tracking-wide">
                Craftsmanship & Spec Sheet
              </h3>
              <p className="text-xs text-stone-400 font-sans leading-relaxed">
                Every Mirrorwala artifact is crafted in our Indore studio using Saint-Gobain ultraclear diamond-cut mirror backing. The LEDs feature a color rendering index (CRI) rating exceeding 90 for authentic skin tones and precise cosmetics vanity lighting.
              </p>
            </div>
            
            <div className="flex flex-col border border-stone-850 rounded overflow-hidden">
              {[
                { label: 'LED Lighting', val: product.LEDType },
                { label: 'Backing Shield', val: product.frameMaterial },
                { label: 'Default Size', val: product.dimensions },
                { label: 'Active SKU', val: product.sku },
                { label: 'Availability', val: product.stock > 0 ? `In Stock (${product.stock} units)` : 'Made to Order' }
              ].map((spec, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center text-xs p-3 font-bold border-b border-stone-850/50 last:border-0 ${
                    i % 2 === 0 ? 'bg-stone-900/40' : 'bg-transparent'
                  }`}
                >
                  <span className="text-stone-500 uppercase tracking-wider">{spec.label}</span>
                  <span className="text-stone-300 text-right">{spec.val}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </PublicLayout>
  );
}
