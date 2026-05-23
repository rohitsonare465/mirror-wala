'use client';

import React, { useState } from 'react';
import { 
  Save, 
  CreditCard, 
  Store, 
  RefreshCw, 
  Sparkles,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { saveHomepageCMSAction } from '@/actions/admin';
import { useRouter } from 'next/navigation';

interface PaymentSettings {
  codEnabled: boolean;
  maxCodAmount: number;
}

interface BusinessDetails {
  supportPhone: string;
  supportEmail: string;
  showroomAddress: string;
  instagramUrl: string;
  facebookUrl: string;
}

interface SettingsClientProps {
  initialPaymentSettings: any;
  initialBusinessDetails: any;
}

export default function SettingsClient({ initialPaymentSettings, initialBusinessDetails }: SettingsClientProps) {
  const router = useRouter();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'payment' | 'business'>('payment');
  const [isSaving, setIsSaving] = useState(false);

  // Cast initial values or use elegant defaults
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => {
    const defaultData = { codEnabled: true, maxCodAmount: 50000 };
    if (initialPaymentSettings) {
      return {
        codEnabled: typeof initialPaymentSettings.codEnabled === 'boolean' ? initialPaymentSettings.codEnabled : defaultData.codEnabled,
        maxCodAmount: typeof initialPaymentSettings.maxCodAmount === 'number' ? initialPaymentSettings.maxCodAmount : defaultData.maxCodAmount,
      };
    }
    return defaultData;
  });

  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>(() => {
    const defaultData = {
      supportPhone: '+91 99999 88888',
      supportEmail: 'care@mirrorwala.com',
      showroomAddress: 'Mirrorwala Flagship Showroom, Block 4, Kirti Nagar Industrial Area, New Delhi - 110015',
      instagramUrl: 'https://instagram.com/mirrorwala',
      facebookUrl: 'https://facebook.com/mirrorwala',
    };
    if (initialBusinessDetails) {
      return {
        supportPhone: initialBusinessDetails.supportPhone || defaultData.supportPhone,
        supportEmail: initialBusinessDetails.supportEmail || defaultData.supportEmail,
        showroomAddress: initialBusinessDetails.showroomAddress || defaultData.showroomAddress,
        instagramUrl: initialBusinessDetails.instagramUrl || defaultData.instagramUrl,
        facebookUrl: initialBusinessDetails.facebookUrl || defaultData.facebookUrl,
      };
    }
    return defaultData;
  });

  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (paymentSettings.maxCodAmount <= 0) {
        throw new Error('Max COD limit must be a positive number');
      }

      await saveHomepageCMSAction('payment_settings', paymentSettings);
      toast.success('Fulfillment payment thresholds and COD active state saved.', 'Payment Settings Saved');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update payment settings.', 'Settings Error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveBusinessDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveHomepageCMSAction('business_details', businessDetails);
      toast.success('Showroom directory addresses and support socials saved.', 'Directory Saved');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update business details.', 'Settings Error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMockSettings = () => {
    if (activeTab === 'payment') {
      setPaymentSettings({
        codEnabled: true,
        maxCodAmount: 35000,
      });
      toast.info('Drafted standard payment parameter adjustments.', 'Draft Configured');
    } else {
      setBusinessDetails({
        supportPhone: '+91 99999 77777',
        supportEmail: 'contact@mirrorwala.com',
        showroomAddress: 'Mirrorwala Design Hub, DLF Phase 3, Sector 24, Gurugram, Haryana - 122002',
        instagramUrl: 'https://instagram.com/mirrorwala.official',
        facebookUrl: 'https://facebook.com/mirrorwala.official',
      });
      toast.info('Drafted standard business address updates.', 'Draft Configured');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Controls header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-amber-300 font-extrabold font-sans">Business Parameters</span>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">Operational Settings</h1>
          <p className="text-xs text-stone-400 mt-0.5">Edit gateway transaction parameters, COD active ranges, support phone directories, and socials.</p>
        </div>
        <button
          onClick={activeTab === 'payment' ? handleSavePaymentSettings : handleSaveBusinessDetails}
          disabled={isSaving}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-extrabold uppercase tracking-widest text-[10px] py-3.5 px-6 rounded-md hover:from-white hover:to-amber-200 transition-all duration-300 cursor-pointer shadow-lg shadow-amber-400/5 select-none"
        >
          {isSaving ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Publish Active Settings
        </button>
      </div>

      {/* Tab selection */}
      <div className="flex border-b border-stone-850 select-none">
        <button
          onClick={() => setActiveTab('payment')}
          className={`flex items-center gap-2 px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-widest border-b-2 transition-all duration-300 cursor-pointer ${
            activeTab === 'payment' 
              ? 'border-amber-400 text-amber-300' 
              : 'border-transparent text-stone-400 hover:text-white'
          }`}
        >
          <CreditCard className="h-4 w-4" /> Payment Configurations
        </button>
        <button
          onClick={() => setActiveTab('business')}
          className={`flex items-center gap-2 px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-widest border-b-2 transition-all duration-300 cursor-pointer ${
            activeTab === 'business' 
              ? 'border-amber-400 text-amber-300' 
              : 'border-transparent text-stone-400 hover:text-white'
          }`}
        >
          <Store className="h-4 w-4" /> Business Directory
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-stone-900 border border-stone-850 p-6 rounded-md shadow-xl">
        
        {/* PAYMENT SETTINGS FORM */}
        {activeTab === 'payment' && (
          <form onSubmit={handleSavePaymentSettings} className="space-y-5">
            
            <div className="flex justify-between items-center select-none border-b border-stone-850 pb-4">
              <span className="text-[10px] uppercase font-black tracking-widest text-stone-400">
                Fulfillment Payment Parameters
              </span>
              <button
                type="button"
                onClick={handleMockSettings}
                className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-amber-300 hover:text-white transition-colors cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" /> Auto Draft Config
              </button>
            </div>

            <div className="border border-stone-850/80 bg-stone-950/40 rounded p-5 space-y-4">
              <div className="flex items-center gap-2 select-none">
                <input
                  type="checkbox"
                  id="codEnabled"
                  checked={paymentSettings.codEnabled}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, codEnabled: e.target.checked }))}
                  className="rounded border-stone-800 bg-stone-950 text-amber-500 focus:ring-amber-500 h-4 w-4 cursor-pointer"
                />
                <label htmlFor="codEnabled" className="text-[10px] uppercase tracking-wider text-stone-400 font-extrabold cursor-pointer">
                  Enable Cash on Delivery (COD) Checkout Options
                </label>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Maximum COD Basket Value Limit (₹) *</label>
                <input
                  required
                  type="number"
                  disabled={!paymentSettings.codEnabled}
                  value={paymentSettings.maxCodAmount}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, maxCodAmount: parseInt(e.target.value) || 0 }))}
                  placeholder="e.g. 50000"
                  className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none disabled:opacity-40 font-mono text-amber-300 font-bold"
                />
                <p className="text-[10px] text-stone-500">Orders exceeding this limit will automatically block the client from picking COD at checkout, forcing online credit/UPI payment.</p>
              </div>
            </div>

          </form>
        )}

        {/* BUSINESS DETAILS FORM */}
        {activeTab === 'business' && (
          <form onSubmit={handleSaveBusinessDetails} className="space-y-5">
            
            <div className="flex justify-between items-center select-none border-b border-stone-850 pb-4">
              <span className="text-[10px] uppercase font-black tracking-widest text-stone-400 font-sans">
                Official Directory Addresses & Handles
              </span>
              <button
                type="button"
                onClick={handleMockSettings}
                className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-amber-300 hover:text-white transition-colors cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" /> Auto Draft Config
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Official Contact Phone Directory *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-550" />
                  <input
                    required
                    type="text"
                    value={businessDetails.supportPhone}
                    onChange={(e) => setBusinessDetails(prev => ({ ...prev, supportPhone: e.target.value }))}
                    placeholder="e.g. +91 99999 88888"
                    className="w-full bg-stone-950 border border-stone-800 rounded p-3 pl-10 text-xs text-stone-200 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Official Support Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-550" />
                  <input
                    required
                    type="email"
                    value={businessDetails.supportEmail}
                    onChange={(e) => setBusinessDetails(prev => ({ ...prev, supportEmail: e.target.value }))}
                    placeholder="e.g. care@mirrorwala.com"
                    className="w-full bg-stone-950 border border-stone-800 rounded p-3 pl-10 text-xs text-stone-200 focus:border-amber-500 outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Main Flagship Showroom Headquarters Address *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-4 h-4 w-4 text-stone-550" />
                <textarea
                  required
                  rows={3}
                  value={businessDetails.showroomAddress}
                  onChange={(e) => setBusinessDetails(prev => ({ ...prev, showroomAddress: e.target.value }))}
                  placeholder="Enter the official showroom headquarters address..."
                  className="w-full bg-stone-950 border border-stone-800 rounded p-3 pl-10 text-xs text-stone-200 focus:border-amber-500 outline-none resize-none leading-relaxed font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Instagram Handle URL</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-550" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  <input
                    type="text"
                    value={businessDetails.instagramUrl}
                    onChange={(e) => setBusinessDetails(prev => ({ ...prev, instagramUrl: e.target.value }))}
                    placeholder="https://instagram.com/mirrorwala"
                    className="w-full bg-stone-950 border border-stone-800 rounded p-3 pl-10 text-xs text-stone-300 focus:border-amber-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Facebook Fanpage URL</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-550" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  <input
                    type="text"
                    value={businessDetails.facebookUrl}
                    onChange={(e) => setBusinessDetails(prev => ({ ...prev, facebookUrl: e.target.value }))}
                    placeholder="https://facebook.com/mirrorwala"
                    className="w-full bg-stone-950 border border-stone-800 rounded p-3 pl-10 text-xs text-stone-300 focus:border-amber-500 outline-none font-mono"
                  />
                </div>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
