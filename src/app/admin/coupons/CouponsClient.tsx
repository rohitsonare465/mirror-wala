'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Ticket, 
  Trash2, 
  X, 
  Calendar, 
  Sparkles,
  RefreshCw,
  Percent,
  CircleDollarSign,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { createCouponAction, deleteCouponAction } from '@/actions/admin';
import { useRouter } from 'next/navigation';

interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue: number | null;
  maxDiscount: number | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

interface CouponsClientProps {
  initialCoupons: Coupon[];
}

export default function CouponsClient({ initialCoupons }: CouponsClientProps) {
  const router = useRouter();
  const toast = useToast();
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    discountValue: '',
    minOrderValue: '',
    maxDiscount: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
  });

  const handleOpenAddModal = () => {
    setFormData({
      code: '',
      discountType: 'PERCENTAGE',
      discountValue: '',
      minOrderValue: '',
      maxDiscount: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate inputs
      const discountVal = parseFloat(formData.discountValue);
      if (isNaN(discountVal) || discountVal <= 0) {
        throw new Error('Discount value must be a positive number');
      }

      if (formData.discountType === 'PERCENTAGE' && discountVal > 100) {
        throw new Error('Percentage discount cannot exceed 100%');
      }

      const minVal = formData.minOrderValue ? parseFloat(formData.minOrderValue) : null;
      const maxVal = formData.maxDiscount ? parseFloat(formData.maxDiscount) : null;

      const payload = {
        code: formData.code.toUpperCase().trim(),
        discountType: formData.discountType,
        discountValue: discountVal,
        minOrderValue: minVal,
        maxDiscount: maxVal,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive,
      };

      const response = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create coupon');
      }

      toast.success(`Coupon code ${payload.code} successfully registered.`, 'Voucher Added');
      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Verification failure. Please correct fields.', 'Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = async (coupon: Coupon) => {
    if (!confirm(`Are you sure you want to permanently remove coupon "${coupon.code}"?`)) return;

    setDeletingId(coupon.id);
    try {
      const response = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete coupon');
      }

      toast.success(`Coupon code ${coupon.code} removed from the registry.`, 'Coupon Deleted');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed.', 'Database Error');
    } finally {
      setDeletingId(null);
    }
  };

  const generateRandomCode = () => {
    const prefixes = ['MIRROR', 'WALA', 'GLAM', 'LUXE', 'BACKLIT', 'ROYAL'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(10 + Math.random() * 90); // 10 to 99
    setFormData(prev => ({
      ...prev,
      code: `${randomPrefix}${randomNum}`,
      discountValue: randomPrefix === 'LUXE' ? '15' : '10',
    }));
  };

  const isExpired = (endDateStr: string) => {
    return new Date(endDateStr).getTime() < Date.now();
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Controls header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-amber-300 font-extrabold font-sans">Campaign Incentives</span>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">Discount Coupon Registry</h1>
          <p className="text-xs text-stone-400 mt-0.5">Manage absolute or percentage vouchers, active intervals, and minimum purchase gates.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-extrabold uppercase tracking-widest text-[10px] py-3.5 px-6 rounded-md hover:from-white hover:to-amber-200 transition-all duration-300 cursor-pointer shadow-lg shadow-amber-400/5"
        >
          <Plus className="h-4 w-4" /> Create Coupon
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialCoupons.length === 0 ? (
          <div className="col-span-full bg-stone-900 border border-stone-850 p-16 rounded-md text-center text-stone-500 font-sans">
            No dynamic coupon vouchers currently configured. Click "Create Coupon" to start.
          </div>
        ) : (
          initialCoupons.map(coupon => {
            const expired = isExpired(coupon.endDate);
            return (
              <div 
                key={coupon.id} 
                className={`bg-stone-900 border rounded-md p-5 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden ${
                  !coupon.isActive || expired 
                    ? 'border-stone-850 opacity-60' 
                    : 'border-stone-850 hover:border-amber-400/30 shadow-xl'
                }`}
              >
                {/* Visual badge highlight */}
                <div className="absolute -right-6 -top-6 h-16 w-16 bg-stone-950/40 rounded-full flex items-center justify-center border border-stone-850 group-hover:bg-amber-400/5 transition-colors">
                  {coupon.discountType === 'PERCENTAGE' ? (
                    <Percent className="h-5 w-5 text-amber-300/40 group-hover:text-amber-300 transition-colors" />
                  ) : (
                    <CircleDollarSign className="h-5 w-5 text-amber-300/40 group-hover:text-amber-300 transition-colors" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-black text-white tracking-widest bg-stone-950 border border-stone-800 px-3 py-1 rounded">
                      {coupon.code}
                    </span>
                    <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded ${
                      expired 
                        ? 'bg-red-950 border border-red-900/30 text-red-400' 
                        : !coupon.isActive 
                        ? 'bg-stone-950 border border-stone-800 text-stone-500' 
                        : 'bg-green-950 border border-green-900/30 text-green-400'
                    }`}>
                      {expired ? 'Expired' : !coupon.isActive ? 'Inactive' : 'Active'}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-stone-300">
                    <div className="text-sm font-serif font-bold text-amber-300">
                      {coupon.discountType === 'PERCENTAGE' 
                        ? `${coupon.discountValue}% Flat Discount` 
                        : `₹${coupon.discountValue} Off Total Amount`
                      }
                    </div>

                    <div className="text-[11px] text-stone-400 space-y-1">
                      {coupon.minOrderValue && (
                        <div>Min Purchase Gate: <span className="text-white font-mono">₹{coupon.minOrderValue}</span></div>
                      )}
                      {coupon.maxDiscount && coupon.discountType === 'PERCENTAGE' && (
                        <div>Max Limit Cap: <span className="text-white font-mono">₹{coupon.maxDiscount}</span></div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-850/60 flex justify-between items-center text-[10px] text-stone-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {new Date(coupon.startDate).toLocaleDateString(undefined, { dateStyle: 'short' })} - {new Date(coupon.endDate).toLocaleDateString(undefined, { dateStyle: 'short' })}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteClick(coupon)}
                    disabled={deletingId === coupon.id}
                    className="text-stone-400 hover:text-red-400 p-1.5 rounded transition-colors cursor-pointer"
                  >
                    {deletingId === coupon.id ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-stone-900 border border-stone-850 rounded shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-850 flex justify-between items-center select-none bg-stone-950/40">
              <div className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-amber-300" />
                <h3 className="font-serif text-lg font-bold text-white">Create New Coupon Campaign</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form body */}
            <form id="coupon-campaign-form" onSubmit={handleFormSubmit} className="p-6 space-y-4">
              
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center select-none">
                  <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Campaign Voucher Code *</label>
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="text-amber-300 hover:text-white text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" /> Auto Draft Code
                  </button>
                </div>
                <input
                  required
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. MIRRORWALA20"
                  className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Discount Model *</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value as 'PERCENTAGE' | 'FIXED' }))}
                    className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Flat Deduct (₹)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Discount Magnitude Value *</label>
                  <input
                    required
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountValue: e.target.value }))}
                    placeholder={formData.discountType === 'PERCENTAGE' ? 'e.g. 15' : 'e.g. 500'}
                    className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Minimum Basket Gate (₹)</label>
                  <input
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, minOrderValue: e.target.value }))}
                    placeholder="Optional (e.g. 1999)"
                    className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Maximum Cap Limit (₹)</label>
                  <input
                    type="number"
                    disabled={formData.discountType === 'FIXED'}
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxDiscount: e.target.value }))}
                    placeholder={formData.discountType === 'FIXED' ? 'Not Applicable' : 'Optional (e.g. 1000)'}
                    className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none disabled:opacity-40 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Interval Start Date *</label>
                  <input
                    required
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Interval End Date *</label>
                  <input
                    required
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 select-none">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-stone-800 bg-stone-950 text-amber-500 focus:ring-amber-500 h-4 w-4"
                />
                <label htmlFor="isActive" className="text-[10px] uppercase tracking-wider text-stone-400 font-extrabold cursor-pointer">
                  Activate Voucher Immediately
                </label>
              </div>

            </form>

            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-stone-850 bg-stone-950/60 flex items-center justify-end gap-3 select-none">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-stone-850 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 text-[10px] font-extrabold uppercase tracking-widest py-3 px-6 rounded-md transition-colors cursor-pointer"
              >
                Close Dialog
              </button>
              <button
                type="submit"
                form="coupon-campaign-form"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-extrabold uppercase tracking-widest text-[10px] py-3 px-6 rounded-md hover:from-white hover:to-amber-200 disabled:opacity-50 transition-all duration-300 cursor-pointer shadow-lg shadow-amber-400/5"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> creating...
                  </>
                ) : (
                  'Deploy Coupon Campaign'
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
