'use client';

import React, { useState, useEffect } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import CloudinaryImage from '@/components/common/CloudinaryImage';
import { useCartStore } from '@/store/useCartStore';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CreditCard, Truck, Tag, ChevronLeft, AlertCircle, CheckCircle2, ShoppingBag } from 'lucide-react';
import { Analytics } from '@/lib/analytics';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  
  const {
    items,
    coupon,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscountAmount,
    getTaxAmount,
    getTotalAmount,
    clearCart,
    removeItem
  } = useCartStore();

  const [mounted, setMounted] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY'>('COD');
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Autofill if user is logged in
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        fullName: session.user.name || '',
        email: session.user.email || '',
        phone: (session.user as any).phone || ''
      }));
    }
  }, [session]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
      // Mock local backup verification for key codes
      const mockCodes: Record<string, any> = {
        'FESTIVE15': { id: 'c_festive15', code: 'FESTIVE15', discountType: 'PERCENTAGE', discountValue: 15, maxDiscount: 5000 },
        'ROYALGOLD': { id: 'c_royalgold', code: 'ROYALGOLD', discountType: 'FIXED', discountValue: 2000, minOrderValue: 20000 }
      };

      const matched = mockCodes[couponCodeInput.toUpperCase()];
      if (matched) {
        applyCoupon(matched);
        setCouponSuccess(`Promo "${matched.code}" applied successfully!`);
      } else {
        setCouponError('Invalid or expired coupon code.');
      }
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponSuccess('');
    setCouponCodeInput('');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    if (items.length === 0) {
      setSubmitError('Your shopping cart is empty.');
      setIsSubmitting(false);
      return;
    }

    // Prepare payload
    const payload = {
      shippingAddress: {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        addressLine: formData.addressLine,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country
      },
      items: items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        customizationDetails: JSON.stringify({
          size: item.variant ? `${item.variant.width}x${item.variant.height}mm` : 'Standard',
          led: item.customization?.ledColor || 'NONE'
        })
      })),
      paymentMethod,
      couponCode: coupon?.code || null
    };

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to place order.');
      }

      const orderData = result.data;

      // Handle COD
      if (paymentMethod === 'COD') {
        Analytics.trackPurchase({
          id: orderData.order.id,
          total: getTotalAmount(),
          currency: 'INR',
          items: items.map(i => ({
            id: i.product.id,
            name: i.product.name,
            price: i.unitPrice,
            quantity: i.quantity
          }))
        });

        setOrderPlacedSuccess(orderData.order);
        clearCart();
        setIsSubmitting(false);
        return;
      }

      // Handle Razorpay secure gateway
      if (paymentMethod === 'RAZORPAY' && orderData.gatewayDetails?.razorpayOrderId) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
          amount: orderData.gatewayDetails.amount,
          currency: 'INR',
          name: 'Mirrorwala',
          description: 'Luxury Showroom Reflections',
          order_id: orderData.gatewayDetails.razorpayOrderId,
          handler: async function (response: any) {
            try {
              // Verify on server
              const verifyRes = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  orderId: orderData.order.id
                })
              });
              const verifyResult = await verifyRes.json();
              if (verifyResult.success) {
                Analytics.trackPurchase({
                  id: orderData.order.id,
                  total: getTotalAmount(),
                  currency: 'INR',
                  items: items.map(i => ({
                    id: i.product.id,
                    name: i.product.name,
                    price: i.unitPrice,
                    quantity: i.quantity
                  }))
                });
                setOrderPlacedSuccess(orderData.order);
                clearCart();
              } else {
                setSubmitError('Payment verification failed. Please contact support.');
              }
            } catch {
              setSubmitError('Error verifying transaction. Please check your account statement.');
            }
          },
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone
          },
          theme: {
            color: '#d97706' // Warm amber theme accent
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setSubmitError(`Payment failed: ${resp.error.description}`);
        });
        rzp.open();
      }
    } catch (err: any) {
      // Self-healing checkout for stale product IDs
      if (err.message && err.message.includes('Product not found in catalog:')) {
        const parts = err.message.split('Product not found in catalog:');
        const invalidProductId = parts[1]?.trim();
        if (invalidProductId) {
          const storeItem = items.find(i => i.productId === invalidProductId || i.product.id === invalidProductId);
          if (storeItem) {
            removeItem(storeItem.id);
            setSubmitError(`The product "${storeItem.product.name}" is currently unavailable and has been removed from your cart. Please try checking out again.`);
            setIsSubmitting(false);
            return;
          }
        }
      }
      setSubmitError(err.message || 'An error occurred during checkout processing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderPlacedSuccess) {
    return (
      <PublicLayout>
        <section className="bg-stone-950 min-h-[70vh] flex items-center justify-center py-16 px-4 font-sans text-stone-200">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-stone-900 border border-stone-850 p-8 rounded text-center flex flex-col items-center gap-6 shadow-2xl"
          >
            <div className="h-16 w-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center text-amber-400">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-amber-300 font-extrabold">Order Confirmed</span>
              <h1 className="font-serif text-2xl font-bold text-white">Reflections Reserved</h1>
              <p className="text-xs text-stone-400 leading-relaxed mt-1">
                Thank you for your order. Our master craftsmen in Indore have been notified, and your luxury mirror commission is being prepared.
              </p>
            </div>

            <div className="w-full border-t border-stone-850 py-4 flex flex-col gap-2 text-xs text-left">
              <div className="flex justify-between">
                <span className="text-stone-500">Order ID:</span>
                <span className="font-bold text-white font-mono">{orderPlacedSuccess.id || 'MW-ORD-98242'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Total Value:</span>
                <span className="font-bold text-amber-200 font-serif">₹{getTotalAmount().toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Payment Status:</span>
                <span className="font-bold text-green-500 uppercase tracking-wide">
                  {paymentMethod === 'COD' ? 'Pending (COD)' : 'Paid Successfully'}
                </span>
              </div>
            </div>

            <div className="flex flex-col w-full gap-3">
              <button
                onClick={() => router.push('/orders')}
                className="w-full bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-extrabold uppercase tracking-widest text-[10px] py-3 rounded"
              >
                Track Commission Order
              </button>
              <button
                onClick={() => router.push('/collections')}
                className="w-full bg-stone-800 hover:bg-stone-750 text-stone-300 font-extrabold uppercase tracking-widest text-[10px] py-3 rounded transition-colors"
              >
                Continue Showroom Browsing
              </button>
            </div>
          </motion.div>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <section className="bg-stone-950 py-12 md:py-20 font-sans text-stone-300">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          {!mounted ? (
            <div className="text-center py-20 bg-stone-900/40 rounded border border-stone-850 flex flex-col items-center justify-center gap-4">
              <span className="text-stone-500 text-xs">Loading secure showroom checkout...</span>
            </div>
          ) : (
            <>
              {/* Header Link Back */}
              <div className="flex items-center gap-1.5 mb-8">
                <button
                  onClick={() => router.push('/cart')}
                  className="flex items-center gap-1 text-xs text-stone-500 hover:text-amber-200 transition-colors uppercase tracking-widest font-bold"
                >
                  <ChevronLeft className="h-4 w-4" /> Back to Cart
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Form details input container (7 Cols) */}
            <form onSubmit={handleSubmitOrder} className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Box: Secure Credentials */}
              <div className="p-6 rounded bg-stone-900/60 border border-stone-850 flex flex-col gap-4">
                <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2 border-b border-stone-850/60 pb-3">
                  <Lock className="h-4.5 w-4.5 text-amber-300" /> Secure Customer Information
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-stone-500 font-extrabold">Full Name</label>
                    <input
                      required
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-stone-500 font-extrabold">Contact Phone</label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit number"
                      className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-stone-500 font-extrabold">Email Address</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@luxurymail.com"
                    className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Box: Shipping coordinates */}
              <div className="p-6 rounded bg-stone-900/60 border border-stone-850 flex flex-col gap-4">
                <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2 border-b border-stone-850/60 pb-3">
                  <Truck className="h-4.5 w-4.5 text-amber-300" /> Shipping Coordinates
                </h2>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-stone-500 font-extrabold">Atelier Delivery Address</label>
                  <input
                    required
                    type="text"
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleInputChange}
                    placeholder="Apartment, suite, street address"
                    className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-stone-500 font-extrabold">City</label>
                    <input
                      required
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Indore"
                      className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-stone-500 font-extrabold">State</label>
                    <input
                      required
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="e.g. Madhya Pradesh"
                      className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-stone-500 font-extrabold">Pincode</label>
                    <input
                      required
                      type="text"
                      pattern="[0-9]{6}"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="6 digits code"
                      className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-stone-500 font-extrabold">Country</label>
                    <input
                      disabled
                      type="text"
                      name="country"
                      value={formData.country}
                      className="bg-stone-900 border border-stone-800 rounded p-3 text-xs text-stone-500 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Box: Gateway options */}
              <div className="p-6 rounded bg-stone-900/60 border border-stone-850 flex flex-col gap-4">
                <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2 border-b border-stone-850/60 pb-3">
                  <CreditCard className="h-4.5 w-4.5 text-amber-300" /> Gateway Checkout Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-4 rounded border text-left flex flex-col gap-2 transition-all duration-300 ${
                      paymentMethod === 'COD'
                        ? 'border-amber-400 bg-amber-500/5'
                        : 'border-stone-800 bg-stone-950/40'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs uppercase tracking-widest font-extrabold text-white">Cash on Delivery</span>
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'COD' ? 'border-amber-400' : 'border-stone-600'
                      }`}>
                        {paymentMethod === 'COD' && <div className="h-2 w-2 rounded-full bg-amber-400" />}
                      </div>
                    </div>
                    <span className="text-[10px] text-stone-500">Pay inside Indore region during shipping release.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('RAZORPAY')}
                    className={`p-4 rounded border text-left flex flex-col gap-2 transition-all duration-300 ${
                      paymentMethod === 'RAZORPAY'
                        ? 'border-amber-400 bg-amber-500/5'
                        : 'border-stone-800 bg-stone-950/40'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs uppercase tracking-widest font-extrabold text-white">Secure Gateway</span>
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'RAZORPAY' ? 'border-amber-400' : 'border-stone-600'
                      }`}>
                        {paymentMethod === 'RAZORPAY' && <div className="h-2 w-2 rounded-full bg-amber-400" />}
                      </div>
                    </div>
                    <span className="text-[10px] text-stone-500">Pay securely via Razorpay (UPI, Cards, Netbanking).</span>
                  </button>
                </div>
              </div>

              {submitError && (
                <div className="p-4 bg-red-950/20 border border-red-900 text-red-400 text-xs rounded flex items-center gap-2">
                  <AlertCircle className="h-4.5 w-4.5" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Purchase completion */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-extrabold uppercase tracking-widest text-xs py-4 rounded hover:from-white hover:to-amber-200 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Securing Order Details...</span>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Authorize Order • ₹{getTotalAmount().toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>

            </form>

            {/* Right Column: Order Cart Checklist (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6 sticky top-28">
              
              <div className="p-6 rounded bg-stone-900 border border-stone-850 flex flex-col gap-4">
                <h3 className="font-serif text-lg font-bold text-white border-b border-stone-850 pb-3 flex items-center gap-2">
                  <ShoppingBag className="h-4.5 w-4.5 text-amber-300" /> Purchase Summary
                </h3>

                {/* Items in summary list */}
                <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
                  {items.length === 0 ? (
                    <div className="text-center py-6 text-xs text-stone-500">
                      No items in cart. Custom mirror details will render here.
                    </div>
                  ) : (
                    items.map(item => (
                      <div key={item.id} className="flex gap-3 items-center text-xs py-2 border-b border-stone-850/50 last:border-0">
                        <div className="relative w-12 h-12 rounded border border-stone-800 overflow-hidden flex-shrink-0 bg-stone-950">
                          <CloudinaryImage
                            src={item.product.images?.[0] || '/images/hero_mirror.png'}
                            alt={item.product.name}
                            fill
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white truncate">{item.product.name}</h4>
                          <span className="text-[10px] text-stone-500">
                            Qty: {item.quantity} • {item.variant ? `${item.variant.width}x${item.variant.height}mm` : 'Standard'}
                          </span>
                        </div>
                        <span className="font-serif font-bold text-amber-200 text-right ml-2">
                          ₹{item.totalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Coupon component box */}
                <div className="pt-2 border-t border-stone-850/80 flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 font-extrabold flex items-center gap-1">
                    <Tag className="h-3 w-3 text-amber-300" /> Promocode Discount
                  </span>
                  
                  {coupon ? (
                    <div className="p-3 rounded border border-green-500/20 bg-green-950/10 flex justify-between items-center">
                      <div className="flex flex-col gap-0.5 text-left">
                        <span className="text-[11px] font-bold text-green-400 font-mono">{coupon.code}</span>
                        <span className="text-[9px] text-stone-500">
                          Discount of {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`} applied
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-[10px] text-red-400 hover:text-red-300 font-bold uppercase tracking-wide"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        placeholder="FESTIVE15 or ROYALGOLD"
                        className="bg-stone-950 border border-stone-800 rounded p-2 text-xs flex-1 uppercase outline-none focus:border-amber-500 text-stone-200"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="bg-stone-800 hover:bg-stone-750 text-white font-extrabold text-[10px] uppercase tracking-widest px-4 rounded transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  {couponError && <span className="text-[10px] text-red-400 mt-1">{couponError}</span>}
                  {couponSuccess && <span className="text-[10px] text-green-400 mt-1">{couponSuccess}</span>}
                </div>

                {/* Invoiced Details list */}
                <div className="flex flex-col gap-3.5 border-t border-stone-850 pt-4 text-xs font-bold">
                  <div className="flex justify-between text-stone-500">
                    <span className="uppercase tracking-widest">Subtotal</span>
                    <span className="text-stone-300 font-serif font-medium">₹{getSubtotal().toLocaleString('en-IN')}</span>
                  </div>

                  {coupon && (
                    <div className="flex justify-between text-green-500">
                      <span className="uppercase tracking-widest">Discount applied</span>
                      <span className="font-serif">-₹{getDiscountAmount().toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-500">
                    <span className="uppercase tracking-widest">Atelier GST (18%)</span>
                    <span className="text-stone-300 font-serif font-medium">₹{Math.round(getTaxAmount()).toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-stone-500">
                    <span className="uppercase tracking-widest">Secure Crate Shipping</span>
                    <span className="text-green-500 uppercase tracking-widest text-[9px] bg-green-950/20 border border-green-950 px-1.5 py-0.5 rounded">
                      Free
                    </span>
                  </div>

                  <div className="border-t border-stone-850 pt-4 flex justify-between items-baseline">
                    <span className="text-xs uppercase tracking-widest text-stone-400">Grand Invoice</span>
                    <span className="font-serif text-2xl font-extrabold text-amber-200">
                      ₹{Math.round(getTotalAmount()).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </div>
          </>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}

