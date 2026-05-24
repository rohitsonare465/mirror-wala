'use client';

import React, { useState } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import CloudinaryImage from '@/components/common/CloudinaryImage';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, Trash2, ShieldCheck, Truck, RefreshCw, Tag, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Analytics } from '@/lib/analytics';
import { useCartStore } from '@/store/useCartStore';

export default function CartPage() {
  const {
    items,
    coupon,
    applyCoupon,
    removeCoupon,
    updateQuantity,
    removeItem,
    getSubtotal,
    getDiscountAmount,
    getTaxAmount,
    getTotalAmount
  } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [pincode, setPincode] = useState('');

  React.useEffect(() => {
    setMounted(true);
  }, []);
  const [shippingEstimate, setShippingEstimate] = useState<string | null>(null);

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) return;
    setCouponError('');
    setCouponSuccess('');

    try {
      const response = await fetch(`/api/coupons?code=${couponCodeInput.toUpperCase()}`);
      const result = await response.json();

      if (result.success && result.data) {
        applyCoupon(result.data);
        setCouponSuccess(`Coupon "${result.data.code}" applied successfully!`);
      } else {
        setCouponError(result.error || 'Invalid or expired coupon code.');
      }
    } catch {
      // Mock local backup verification for Indore luxury launch codes
      const mockCodes: Record<string, any> = {
        'FESTIVE15': { id: 'c_festive15', code: 'FESTIVE15', discountType: 'PERCENTAGE', discountValue: 15, maxDiscount: 5000 },
        'ROYALGOLD': { id: 'c_royalgold', code: 'ROYALGOLD', discountType: 'FIXED', discountValue: 2000, minOrderValue: 20000 }
      };

      const matched = mockCodes[couponCodeInput.toUpperCase()];
      if (matched) {
        if (matched.minOrderValue && getSubtotal() < matched.minOrderValue) {
          setCouponError(`Min order value of ₹${matched.minOrderValue.toLocaleString('en-IN')} required.`);
        } else {
          applyCoupon(matched);
          setCouponSuccess(`Coupon "${matched.code}" applied!`);
        }
      } else {
        setCouponError('Invalid or expired coupon code.');
      }
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCodeInput('');
    setCouponSuccess('');
    setCouponError('');
  };

  const handleEstimateShipping = () => {
    if (!pincode.trim() || pincode.length !== 6) {
      setShippingEstimate('Please enter a valid 6-digit Pincode.');
      return;
    }
    // Dynamic premium Indori pincode routing simulator
    const isIndore = pincode.startsWith('452');
    if (isIndore) {
      setShippingEstimate('Atelier Indore Shipping: FREE Delivery in 24-48 Hours!');
    } else {
      setShippingEstimate('National Secure Wooden-Crate Shipping: FREE (Takes 4-6 Days).');
    }
  };

  const handleCheckoutTrigger = () => {
    Analytics.trackCheckoutStarted({
      items: items.map(i => ({
        product: {
          id: i.productId,
          name: i.product.name,
          price: i.unitPrice,
          category: i.product.categoryName || 'Luxury Mirror',
          sku: i.product.sku,
        },
        quantity: i.quantity,
      })),
      total: getTotalAmount(),
    });
  };

  return (
    <PublicLayout>
      {/* Intro Header */}
      <section className="relative py-16 bg-gradient-to-b from-stone-900 to-stone-950 border-b border-stone-900 text-center">
        <div className="container mx-auto px-4 md:px-8 flex flex-col items-center gap-3">
          <ShoppingBag className="h-10 w-10 text-amber-300 animate-pulse" />
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">Your Shopping Cart</h1>
          <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-2" />
        </div>
      </section>

      {/* Cart Content Viewport */}
      <section className="bg-stone-950 py-12 text-stone-300 font-sans flex-1">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          {!mounted ? (
            <div className="text-center py-20 bg-stone-900/40 rounded border border-stone-850 flex flex-col items-center justify-center gap-4">
              <span className="text-stone-500 text-xs">Loading luxury showroom cart...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 bg-stone-900/40 rounded border border-stone-850 flex flex-col items-center gap-6">
              <span className="text-stone-500 text-sm">Your shopping cart is currently empty.</span>
              <Link
                href="/collections"
                className="bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-extrabold text-xs uppercase tracking-widest px-6 py-3 rounded hover:from-white hover:to-amber-250 transition-all duration-300 shadow shadow-amber-400/10 cursor-pointer"
              >
                Continue Showroom Browsing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Items details list */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <AnimatePresence>
                  {items.map(item => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-4 rounded bg-stone-900/60 border border-stone-850 flex gap-4 items-center"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-20 h-20 rounded border border-stone-800 overflow-hidden flex-shrink-0 select-none bg-stone-950">
                        {item.product.images && item.product.images.length > 0 ? (
                          <CloudinaryImage src={item.product.images[0]} alt={item.product.name} fill sizes="80px" className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-stone-850 flex items-center justify-center text-stone-500 text-xs">No Image</div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col gap-1 min-w-0">
                        <span className="text-[9px] uppercase tracking-widest text-amber-300 font-bold">
                          {item.product.categoryName || 'Luxury Mirror'}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-white truncate hover:text-amber-200 transition-colors">
                          <Link href={`/products/${item.product.slug}`}>{item.product.name}</Link>
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-stone-500 font-medium">
                          <span>Size: {item.customization?.features?.[0] || 'Standard (600x800mm)'}</span>
                          {item.customization?.ledColor && item.customization.ledColor !== 'NONE' && (
                            <span>LED Glow: {item.customization.ledColor}</span>
                          )}
                        </div>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center border border-stone-800 rounded bg-stone-950 text-xs">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2.5 py-1.5 text-stone-500 hover:text-amber-200"
                        >
                          -
                        </button>
                        <span className="px-1 text-stone-200 font-bold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1.5 text-stone-500 hover:text-amber-200"
                        >
                          +
                        </button>
                      </div>

                      {/* Price & Delete */}
                      <div className="flex flex-col items-end gap-2 pl-2">
                        <span className="font-serif text-sm font-extrabold text-amber-200">
                          ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-stone-500 hover:text-red-400 p-1 transition-colors"
                          aria-label="Remove Item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Shipping Estimator Section */}
                <div className="p-5 rounded bg-stone-900/40 border border-stone-850 mt-4 flex flex-col gap-3">
                  <span className="text-xs uppercase tracking-wider font-extrabold text-stone-300">
                    Estimate Delivery & Transit time:
                  </span>
                  <div className="flex items-center gap-2 max-w-sm">
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit Pincode"
                      className="flex-1 bg-stone-950 border border-stone-800 rounded px-3 py-2 text-xs font-bold text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={handleEstimateShipping}
                      className="bg-stone-800 text-amber-300 font-extrabold text-xs uppercase tracking-widest px-4 py-2 rounded hover:bg-stone-750 transition-colors"
                    >
                      Estimate
                    </button>
                  </div>
                  {shippingEstimate && (
                    <span className={`text-xs font-semibold ${shippingEstimate.includes('FREE') ? 'text-amber-200' : 'text-stone-500'}`}>
                      {shippingEstimate}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column: Checkout Pricing Summary */}
              <div className="lg:col-span-4 flex flex-col gap-6 sticky top-28">
                
                <div className="p-6 rounded bg-stone-900 border border-stone-850 flex flex-col gap-4">
                  <h3 className="font-serif text-lg font-bold text-white border-b border-stone-850/60 pb-3">Cart Summary</h3>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500 uppercase tracking-widest">Subtotal</span>
                    <span className="text-stone-300 font-bold">₹{getSubtotal().toLocaleString('en-IN')}</span>
                  </div>

                  {/* Coupon section */}
                  {coupon ? (
                    <div className="flex justify-between items-center text-xs p-2 rounded bg-amber-500/5 border border-amber-500/10">
                      <span className="text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Tag className="h-3.5 w-3.5" /> {coupon.code}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 font-bold">-₹{getDiscountAmount().toLocaleString('en-IN')}</span>
                        <button onClick={handleRemoveCoupon} className="text-[10px] text-stone-500 hover:text-red-400 underline uppercase tracking-wider font-extrabold">
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 pt-2 border-t border-stone-850/40">
                      <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Have a Coupon?</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={couponCodeInput}
                          onChange={(e) => setCouponCodeInput(e.target.value)}
                          placeholder="e.g. FESTIVE15"
                          className="flex-1 bg-stone-950 border border-stone-850 rounded px-2.5 py-1.5 text-xs text-white placeholder-stone-700 uppercase focus:outline-none focus:border-amber-400"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          className="bg-stone-800 text-stone-300 font-extrabold text-[10px] uppercase tracking-widest px-3 py-2 rounded hover:bg-stone-750"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && (
                        <div className="flex items-center gap-1 text-[10px] text-red-400 font-semibold">
                          <AlertCircle className="h-3 w-3" />
                          <span>{couponError}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500 uppercase tracking-widest">Atelier Shipping</span>
                    <span className="text-green-500 font-bold uppercase tracking-widest text-[9px] bg-green-950/20 border border-green-950 px-1.5 py-0.5 rounded">
                      Free
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs border-t border-stone-850/30 pt-3">
                    <div className="flex flex-col">
                      <span className="text-stone-500 uppercase tracking-widest">Atelier GST (18%)</span>
                      <span className="text-[9px] text-stone-500 font-sans">Included in subtotal</span>
                    </div>
                    <span className="text-stone-400 font-semibold">₹{getTaxAmount().toLocaleString('en-IN')}</span>
                  </div>

                  <div className="border-t border-stone-850 pt-4 flex justify-between items-baseline">
                    <span className="text-xs uppercase tracking-widest text-stone-400 font-bold">Total Amount</span>
                    <span className="font-serif text-2xl font-extrabold text-amber-200">
                      ₹{getTotalAmount().toLocaleString('en-IN')}
                    </span>
                  </div>

                  <Link
                    href="/checkout"
                    onClick={handleCheckoutTrigger}
                    className="w-full bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-extrabold text-xs uppercase tracking-widest py-3.5 rounded hover:from-white hover:to-amber-200 transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow mt-2"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Assurance details */}
                <div className="flex flex-col gap-3 p-4 rounded bg-stone-900/20 border border-stone-850 text-[10px] text-stone-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4.5 w-4.5 text-amber-300" />
                    <span>Secure checkout encrypted by SSL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4.5 w-4.5 text-amber-300" />
                    <span>Safe transit wooden crate packing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4.5 w-4.5 text-amber-300" />
                    <span>Free replacement on transit cracks</span>
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
