'use client';

import React, { useState } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, Calendar, Tag, ShieldCheck, HelpCircle, ArrowRight, Clock, Truck, ShieldAlert } from 'lucide-react';
import CloudinaryImage from '@/components/common/CloudinaryImage';

// Luxury mock orders to populate client space beautifully
const MOCK_ORDERS = [
  {
    id: 'MW-ORD-88491',
    createdAt: '2026-05-10T14:32:00Z',
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'RAZORPAY',
    totalPrice: 19999,
    items: [
      {
        id: 'ord_item_01',
        product: {
          name: 'Aura Smart LED Bulb Mirror',
          image: '/images/lightbulb_led.jpg',
          sku: 'MW-LED-AURA-04',
        },
        quantity: 1,
        customizationDetails: 'Size: Standard (650x900mm), LED Glow: Tri-color Dimmable'
      }
    ]
  },
  {
    id: 'MW-ORD-90241',
    createdAt: '2026-05-18T10:15:00Z',
    status: 'Processing',
    paymentStatus: 'Pending',
    paymentMethod: 'COD',
    totalPrice: 38000,
    items: [
      {
        id: 'ord_item_02',
        product: {
          name: 'Designer Gold Frame Mirror',
          image: '/images/designer_category.png',
          sku: 'MW-DSN-GOLD-03',
        },
        quantity: 1,
        customizationDetails: 'Size: Standard (800x1100mm), Frame: Champagne Gold Leaf Finish'
      }
    ]
  }
];

export default function OrdersPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [orders, setOrders] = useState(MOCK_ORDERS);

  if (isPending) {
    return (
      <PublicLayout>
        <section className="bg-stone-950 min-h-[80vh] flex items-center justify-center text-stone-400 font-sans text-xs">
          <span>Loading Order History...</span>
        </section>
      </PublicLayout>
    );
  }

  if (!session) {
    return (
      <PublicLayout>
        <section className="bg-stone-950 min-h-[80vh] flex items-center justify-center p-4 font-sans text-stone-300">
          <div className="max-w-md w-full bg-stone-900 border border-stone-850 p-8 rounded text-center flex flex-col items-center gap-6">
            <ShieldAlert className="h-10 w-10 text-amber-300" />
            <div>
              <h1 className="font-serif text-2xl font-bold text-white">Access Restricted</h1>
              <p className="text-xs text-stone-400 leading-relaxed mt-2">
                Authentication is required to view historical commissions.
              </p>
            </div>
            <button
              onClick={() => router.push('/login?callbackUrl=/orders')}
              className="w-full bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-extrabold uppercase tracking-widest text-[10px] py-3 rounded"
            >
              Sign In to Your Account
            </button>
          </div>
        </section>
      </PublicLayout>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <ShieldCheck className="h-4 w-4 text-green-400" />;
      case 'Processing':
      case 'Packed':
        return <Clock className="h-4 w-4 text-amber-400 animate-pulse" />;
      case 'OutForDelivery':
        return <Truck className="h-4 w-4 text-amber-300" />;
      default:
        return <HelpCircle className="h-4 w-4 text-stone-400" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-950/20 text-green-400 border-green-900/30';
      case 'Processing':
      case 'Packed':
      case 'OutForDelivery':
        return 'bg-amber-950/20 text-amber-300 border-amber-900/30';
      case 'Cancelled':
        return 'bg-red-950/20 text-red-400 border-red-900/30';
      default:
        return 'bg-stone-900 text-stone-400 border-stone-800';
    }
  };

  return (
    <PublicLayout>
      <section className="bg-stone-950 py-12 md:py-20 font-sans text-stone-300">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          
          {/* Header page banner */}
          <div className="flex flex-col gap-2 border-b border-stone-850 pb-6 mb-10 select-none">
            <span className="text-[10px] uppercase tracking-widest text-amber-300 font-extrabold flex items-center gap-1">
              <Package className="h-3.5 w-3.5" /> Order Tracking
            </span>
            <h1 className="font-serif text-3xl font-bold text-white tracking-tight">
              Your Commissions
            </h1>
            <p className="text-xs text-stone-500 font-sans mt-0.5">
              Review current status, tracking details, and historic receipts for your custom interior mirrors.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {orders.length === 0 ? (
              <div className="text-center py-20 bg-stone-900/30 border border-stone-850 rounded flex flex-col items-center gap-6">
                <span className="text-stone-500 text-sm">You have not commissioned any luxury mirrors yet.</span>
                <button
                  onClick={() => router.push('/collections')}
                  className="bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-extrabold text-xs uppercase tracking-widest px-6 py-3 rounded"
                >
                  Explore Showroom Catalog
                </button>
              </div>
            ) : (
              orders.map(order => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-stone-900/60 border border-stone-850 rounded-lg overflow-hidden shadow-xl"
                >
                  {/* Order Top Summary Bar */}
                  <div className="bg-stone-900 p-4 border-b border-stone-850 flex flex-wrap justify-between items-center gap-4 text-xs font-bold">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-widest text-stone-500">Commission Date</span>
                        <span className="text-stone-300 font-sans flex items-center gap-1.5 mt-0.5">
                          <Calendar className="h-3.5 w-3.5 text-stone-500" />
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-widest text-stone-500">Order ID Reference</span>
                        <span className="text-white font-mono mt-0.5">{order.id}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-widest text-stone-500">Grand Total</span>
                        <span className="text-amber-200 font-serif font-extrabold mt-0.5">
                          ₹{order.totalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] uppercase tracking-widest font-extrabold px-2.5 py-1 rounded border flex items-center gap-1.5 ${getStatusBadgeClass(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items list details */}
                  <div className="p-6 flex flex-col gap-4">
                    {order.items.map(item => (
                      <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2 border-b border-stone-850/30 last:border-0">
                        <div className="flex gap-4 items-center">
                          {/* Item preview */}
                          <div className="relative w-16 h-16 rounded border border-stone-800 overflow-hidden flex-shrink-0 bg-stone-950">
                            <CloudinaryImage src={item.product.image} alt={item.product.name} fill sizes="64px" />
                          </div>
                          
                          {/* Item specifications details */}
                          <div className="flex flex-col gap-1 text-xs">
                            <h4 className="font-bold text-white leading-snug">{item.product.name}</h4>
                            <span className="text-[10px] text-stone-500 font-mono">SKU: {item.product.sku}</span>
                            <span className="text-[10px] text-stone-400 font-sans leading-relaxed">
                              {item.customizationDetails}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-8 text-xs font-bold text-stone-300">
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer coordinates */}
                  <div className="bg-stone-900/30 p-4 border-t border-stone-850 flex flex-wrap justify-between items-center gap-4 text-[10px] text-stone-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3.5 w-3.5 text-amber-300" />
                      Payment: {order.paymentMethod} • Status: {order.paymentStatus}
                    </span>

                    <button
                      onClick={() => router.push(`/contact?subject=Support Order ${order.id}`)}
                      className="text-stone-500 hover:text-amber-300 flex items-center gap-1 transition-colors uppercase tracking-widest font-extrabold"
                    >
                      Need Support? <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

        </div>
      </section>
    </PublicLayout>
  );
}

