'use client';

import React, { useState, useEffect } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { Sparkles, Sliders, Calculator, CheckCircle2, ChevronRight, PhoneCall, HelpCircle, Loader2 } from 'lucide-react';
import { Analytics } from '@/lib/analytics';

const SHAPES = ['RECTANGULAR', 'ROUND', 'OVAL', 'ARCHED', 'HEXAGONAL', 'CUSTOM'];
const THICKNESSES = [4, 5, 6];
const EDGES = ['POLISHED', 'BEVELED', 'FROSTED'];
const LED_COLORS = ['NONE', 'WARM_WHITE', 'NATURAL_WHITE', 'COOL_WHITE', 'TRI_COLOR', 'RGB'];
const FEATURES = [
  { id: 'TOUCH_SENSOR', label: 'Touch Sensor Toggle' },
  { id: 'HAND_WAVE_SENSOR', label: 'Hand Wave Proximity Sensor' },
  { id: 'DEFOGGER', label: 'Anti-Fog Heating Plate' },
  { id: 'DIGITAL_CLOCK', label: 'Digital Clock Display' },
  { id: 'BLUETOOTH_SPEAKER', label: 'Bluetooth Music Speakers' },
  { id: 'DIMMING', label: 'Continuous Touch Dimming' }
];

export default function CustomMirrorsPage() {
  // Form Configuration State
  const [shape, setShape] = useState('RECTANGULAR');
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(800);
  const [thickness, setThickness] = useState(5);
  const [edgeStyle, setEdgeStyle] = useState('POLISHED');
  const [ledColor, setLedColor] = useState('NONE');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  // Contact details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  // Price calculations - matches EnquiryService calculateCustomPrice
  const calculatePrice = () => {
    // 1. Area based structural rate math
    const areaSqm = (width / 1000) * (height / 1000);
    let glassRatePerSqm = 2000;
    if (thickness === 4) glassRatePerSqm = 1500;
    else if (thickness === 6) glassRatePerSqm = 2500;

    const baseGlassCost = areaSqm * glassRatePerSqm;

    // 2. Shape cutting difficulty multiplier
    const shapeMultipliers: Record<string, number> = {
      RECTANGULAR: 1.0,
      ROUND: 1.2,
      OVAL: 1.3,
      ARCHED: 1.4,
      HEXAGONAL: 1.3,
      CUSTOM: 1.5,
    };
    const shapeMultiplier = shapeMultipliers[shape] || 1.0;
    const shapeGlassCost = baseGlassCost * shapeMultiplier;

    // 3. Edge polishing linear perimeter math
    let perimeterM = 0;
    if (shape === 'ROUND') {
      const diameterM = Math.max(width, height) / 1000;
      perimeterM = Math.PI * diameterM;
    } else {
      perimeterM = 2 * ((width / 1000) + (height / 1000));
    }

    const edgeRates: Record<string, number> = {
      POLISHED: 200,
      BEVELED: 400,
      FROSTED: 300,
    };
    const edgeRate = edgeRates[edgeStyle] || 200;
    const edgeCost = perimeterM * edgeRate;

    // 4. LED illumination lighting premium
    const ledRates: Record<string, number> = {
      NONE: 0,
      WARM_WHITE: 1200,
      NATURAL_WHITE: 1200,
      COOL_WHITE: 1200,
      TRI_COLOR: 2000,
      RGB: 2800,
    };
    const ledCost = ledRates[ledColor] || 0;

    // 5. Smart interactive features
    const featureRates: Record<string, number> = {
      TOUCH_SENSOR: 800,
      HAND_WAVE_SENSOR: 1200,
      DEFOGGER: 1500,
      DIGITAL_CLOCK: 1000,
      BLUETOOTH_SPEAKER: 2500,
      DIMMING: 600,
    };
    const featuresCost = selectedFeatures.reduce((sum, f) => sum + (featureRates[f] || 0), 0);

    const subtotal = shapeGlassCost + edgeCost + ledCost + featuresCost;
    const luxuryHandlingFee = 500;
    const rawTotal = subtotal + luxuryHandlingFee;

    // Round beautifully to nearest 50
    return Math.round(rawTotal / 50) * 50;
  };

  useEffect(() => {
    const price = calculatePrice();
    setEstimatedPrice(price);
  }, [shape, width, height, thickness, edgeStyle, ledColor, selectedFeatures]);

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures(prev =>
      prev.includes(featureId) ? prev.filter(f => f !== featureId) : [...prev, featureId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      setSubmitError('Please fill out all contact fields before submitting quotation.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          subject: `Bespoke custom ${shape.toLowerCase()} quote quotation request`,
          message: `Requesting bespoke custom quote with parameters: Size ${width}x${height}mm, Glass thickness: ${thickness}mm, Finishing Edge: ${edgeStyle}, LED backlight setting: ${ledColor}, Smart features: ${selectedFeatures.join(', ') || 'None'}. Dynamic estimated price: ₹${estimatedPrice.toLocaleString('en-IN')}`,
          type: 'CUSTOM_QUOTE',
          shape,
          width,
          height,
          thickness,
          edgeStyle,
          ledColor,
          features: selectedFeatures,
          estimatedPrice,
        }),
      });

      const resData = await response.json();
      
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to submit quote request. Please try again.');
      }

      setSubmitSuccess(true);
      
      // Tracking Analytics
      Analytics.trackFormSubmission('CUSTOM_QUOTE');

    } catch (err: any) {
      setSubmitError(err.message || 'Quotations system encountered a connection issue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      {/* Editorial Header */}
      <section className="relative py-20 bg-gradient-to-b from-stone-900 to-stone-950 border-b border-stone-900 text-center">
        <div className="container mx-auto px-4 md:px-8 flex flex-col items-center gap-4">
          <span className="text-xs uppercase tracking-widest text-amber-300 font-bold flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Bespoke Mirror Atelier
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Custom Configuration Atelier
          </h1>
          <div className="w-20 h-0.5 bg-gradient-to-r from-amber-200 to-yellow-500 rounded my-1" />
          <p className="text-stone-400 max-w-xl text-xs leading-relaxed font-sans">
            Specify your exact sizing dimensions, hand-finished edge profiles, dynamic smart sensors, and high-fidelity LED lighting options. Review real-time estimates instantly.
          </p>
        </div>
      </section>

      {/* Main Grid View */}
      <section className="bg-stone-950 py-12 md:py-16 text-stone-300 font-sans">
        <div className="container mx-auto px-4 md:px-8">
          {submitSuccess ? (
            <div className="max-w-xl mx-auto text-center py-12 px-8 bg-stone-900/60 rounded border border-amber-500/20 shadow-2xl flex flex-col items-center gap-6">
              <CheckCircle2 className="h-16 w-16 text-green-400 animate-bounce" />
              <div className="flex flex-col gap-2">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">Quotation Submitted Successfully!</h2>
                <p className="text-xs text-stone-400 leading-relaxed mt-1">
                  Thank you, <strong className="text-amber-200">{fullName}</strong>. Our lead engineers at the Indore Dewas Naka studio have received your custom mirror specs. A formal catalog quotation and shipping assessment will be sent to <span className="text-stone-300 font-bold">{email}</span> within 24 hours.
                </p>
              </div>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-bold text-xs uppercase tracking-widest px-6 py-3 rounded hover:from-white hover:to-amber-200 transition-all duration-300"
              >
                Configure Another Mirror
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* Left Column: Interactive Form controls (7 Cols) */}
              <form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-6">
                
                {/* 1. Shape Selection */}
                <div className="p-6 rounded bg-stone-900/40 border border-stone-850 flex flex-col gap-4">
                  <h2 className="text-xs uppercase tracking-wider font-extrabold text-amber-300 flex items-center gap-2">
                    <Sliders className="h-4 w-4" /> 1. Select Mirror Geometry Shape
                  </h2>
                  <div className="grid grid-cols-3 gap-2">
                    {SHAPES.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setShape(s)}
                        className={`text-[10px] sm:text-xs uppercase tracking-widest font-bold py-2.5 px-1 text-center rounded border transition-all duration-300 ${
                          shape === s
                            ? 'border-amber-400 bg-amber-500/5 text-amber-200'
                            : 'border-stone-850 bg-stone-900 text-stone-500 hover:border-amber-550'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Custom Dimensions Sizing */}
                <div className="p-6 rounded bg-stone-900/40 border border-stone-850 flex flex-col gap-4">
                  <h2 className="text-xs uppercase tracking-wider font-extrabold text-amber-300 flex items-center gap-2">
                    <Calculator className="h-4 w-4" /> 2. Sizing Dimensions (mm)
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Width slider */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-stone-400 uppercase tracking-wide">Width (300mm - 2400mm)</span>
                        <span className="text-amber-200">{width} mm</span>
                      </div>
                      <input
                        type="range"
                        min="300"
                        max="2400"
                        step="50"
                        value={width}
                        onChange={e => setWidth(Number(e.target.value))}
                        className="w-full accent-amber-400 bg-stone-800"
                      />
                    </div>
                    {/* Height slider */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-stone-400 uppercase tracking-wide">Height (300mm - 2400mm)</span>
                        <span className="text-amber-200">{height} mm</span>
                      </div>
                      <input
                        type="range"
                        min="300"
                        max="2400"
                        step="50"
                        value={height}
                        onChange={e => setHeight(Number(e.target.value))}
                        className="w-full accent-amber-400 bg-stone-800"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Glass Thickness & Finishing Edge */}
                <div className="p-6 rounded bg-stone-900/40 border border-stone-850 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xs uppercase tracking-wider font-extrabold text-amber-300">
                      3. Thickness
                    </h3>
                    <div className="flex items-center gap-2">
                      {THICKNESSES.map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setThickness(t)}
                          className={`flex-1 text-xs uppercase tracking-widest font-bold py-2 rounded border transition-all duration-300 ${
                            thickness === t
                              ? 'border-amber-400 bg-amber-500/5 text-amber-200'
                              : 'border-stone-850 bg-stone-900 text-stone-500 hover:border-amber-550'
                          }`}
                        >
                          {t}mm
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <h3 className="text-xs uppercase tracking-wider font-extrabold text-amber-300">
                      4. Finishing Edge Style
                    </h3>
                    <div className="flex items-center gap-2">
                      {EDGES.map(e => (
                        <button
                          key={e}
                          type="button"
                          onClick={() => setEdgeStyle(e)}
                          className={`flex-1 text-[10px] sm:text-xs uppercase tracking-widest font-bold py-2 rounded border transition-all duration-300 ${
                            edgeStyle === e
                              ? 'border-amber-400 bg-amber-500/5 text-amber-200'
                              : 'border-stone-850 bg-stone-900 text-stone-500 hover:border-amber-550'
                          }`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. LED Illumination setting */}
                <div className="p-6 rounded bg-stone-900/40 border border-stone-850 flex flex-col gap-4">
                  <h2 className="text-xs uppercase tracking-wider font-extrabold text-amber-300">
                    5. Integrated LED Backlighting Setting
                  </h2>
                  <div className="grid grid-cols-3 gap-2">
                    {LED_COLORS.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setLedColor(c)}
                        className={`text-[9px] sm:text-xs uppercase tracking-widest font-bold py-2.5 px-0.5 text-center rounded border transition-all duration-300 ${
                          ledColor === c
                            ? 'border-amber-400 bg-amber-500/5 text-amber-200'
                            : 'border-stone-850 bg-stone-900 text-stone-500 hover:border-amber-550'
                        }`}
                      >
                        {c.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Smart interactive feature upgrades */}
                <div className="p-6 rounded bg-stone-900/40 border border-stone-850 flex flex-col gap-4">
                  <h2 className="text-xs uppercase tracking-wider font-extrabold text-amber-300">
                    6. Smart Interactive Feature Upgrades
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {FEATURES.map(f => {
                      const isSelected = selectedFeatures.includes(f.id);
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => handleFeatureToggle(f.id)}
                          className={`text-left text-xs p-3 rounded border flex items-center justify-between transition-all duration-300 ${
                            isSelected
                              ? 'border-amber-400 bg-amber-500/5 text-amber-200'
                              : 'border-stone-850 bg-stone-900/40 text-stone-400 hover:border-amber-550'
                          }`}
                        >
                          <span className="font-bold">{f.label}</span>
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            isSelected ? 'bg-amber-400 border-amber-400' : 'border-stone-700'
                          }`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-stone-950" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Lead Contact Information */}
                <div className="p-6 rounded bg-stone-900/40 border border-stone-850 flex flex-col gap-4">
                  <h2 className="text-xs uppercase tracking-wider font-extrabold text-amber-300">
                    7. Lead Contact Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      required
                      className="bg-stone-950 border border-stone-850 rounded p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="email"
                      placeholder="Your Email Address"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="bg-stone-950 border border-stone-850 rounded p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="tel"
                      placeholder="Your Mobile Number"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      required
                      className="bg-stone-950 border border-stone-850 rounded p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Submit trigger */}
                {submitError && (
                  <div className="text-red-400 text-xs font-bold p-3 bg-red-950/20 border border-red-950 rounded">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-extrabold text-xs uppercase tracking-widest py-4 px-8 rounded hover:from-white hover:to-amber-200 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-400/10 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Submitting Configuration...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Bespoke Quote Request</span>
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>

              </form>

              {/* Right Column: Premium Showroom Price Calculator Panel (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6 sticky top-28">
                
                {/* Visual Config Preview Panel */}
                <div className="p-6 rounded bg-stone-900 border border-stone-850 shadow-2xl flex flex-col gap-6">
                  <div className="flex flex-col gap-1 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">Live Showroom Quote</span>
                    <h3 className="font-serif text-2xl font-bold text-white tracking-wide">Artifact Quotation</h3>
                    <div className="w-10 h-0.5 bg-amber-400 mx-auto mt-2" />
                  </div>

                  {/* Summary Spec Checklist */}
                  <div className="flex flex-col border border-stone-850 rounded overflow-hidden text-xs">
                    {[
                      { label: 'Shape Geometry', val: shape },
                      { label: 'Dimensions Size', val: `${width} x ${height} mm` },
                      { label: 'Glass Thickness', val: `${thickness} mm` },
                      { label: 'Finishing Edge', val: edgeStyle },
                      { label: 'LED Glow Color', val: ledColor.replace('_', ' ') },
                      { label: 'Smart Upgrades', val: selectedFeatures.length ? `${selectedFeatures.length} Active` : 'None Selected' }
                    ].map((spec, idx) => (
                      <div
                        key={idx}
                        className={`flex justify-between items-center p-3 font-bold border-b border-stone-850/50 last:border-0 ${
                          idx % 2 === 0 ? 'bg-stone-950/40' : 'bg-transparent'
                        }`}
                      >
                        <span className="text-stone-500 uppercase tracking-widest text-[9px]">{spec.label}</span>
                        <span className="text-stone-300 font-extrabold uppercase tracking-wide">{spec.val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Live Estimated Price */}
                  <div className="p-4 rounded border border-amber-500/10 bg-amber-500/5 text-center flex flex-col gap-1">
                    <span className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">Estimated Cost (Indore Atelier)</span>
                    <span className="font-serif text-4xl font-extrabold text-amber-200">
                      ₹{estimatedPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] text-stone-400 font-sans mt-1">
                      Includes 18% GST, Luxury Packing and Indore Showroom pickup.
                    </span>
                  </div>

                  {/* Guarantee flags */}
                  <div className="flex items-center gap-3 text-[10px] text-stone-400 justify-center">
                    <span className="flex items-center gap-1">
                      <HelpCircle className="h-3.5 w-3.5 text-amber-300" /> Saint-Gobain Glass
                    </span>
                    <span className="text-stone-800">|</span>
                    <span className="flex items-center gap-1">
                      <PhoneCall className="h-3.5 w-3.5 text-amber-300" /> WhatsApp support
                    </span>
                  </div>
                </div>

                {/* Local Showroom Coordinates Info Box */}
                <div className="p-4 rounded border border-stone-850 bg-stone-900/30 flex items-center gap-3">
                  <div className="p-3 bg-amber-500/10 rounded text-amber-400">
                    <PhoneCall className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Indore Showroom</span>
                    <span className="text-xs text-white font-extrabold">+91 98765 43210</span>
                    <span className="text-[9px] text-stone-500 font-sans mt-0.5">Dewas Naka Sector A, Industrial Area, Indore</span>
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
