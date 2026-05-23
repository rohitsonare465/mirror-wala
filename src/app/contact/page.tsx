'use client';

import React, { useState } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { Sparkles, Phone, Mail, MapPin, Send, MessageSquare, CheckCircle2, Loader2 } from 'lucide-react';
import { Analytics } from '@/lib/analytics';

export default function ContactPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Submit states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          subject,
          message,
          type: 'GENERAL',
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Failed to submit inquiry. Please try again.');
      }

      setSubmitSuccess(true);
      
      // Conversion tracking
      Analytics.trackFormSubmission('GENERAL');

      // Clear fields
      setFullName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');

    } catch (err: any) {
      setSubmitError(err.message || 'Inquiries system encountered a connection issue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    Analytics.trackWhatsAppClick('Contact page floating button');
  };

  return (
    <PublicLayout>
      {/* Editorial Header */}
      <section className="relative py-20 bg-gradient-to-b from-stone-900 to-stone-950 border-b border-stone-900 text-center">
        <div className="container mx-auto px-4 md:px-8 flex flex-col items-center gap-4">
          <span className="text-xs uppercase tracking-widest text-amber-300 font-bold flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Direct Support
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Connect With The Showroom
          </h1>
          <div className="w-20 h-0.5 bg-gradient-to-r from-amber-200 to-yellow-500 rounded my-1" />
          <p className="text-stone-400 max-w-xl text-xs leading-relaxed font-sans">
            Schedule a showroom consultation in Indore or send an inquiry to coordinate custom mirrors configurations directly with our designers.
          </p>
        </div>
      </section>

      {/* Main Grid Section */}
      <section className="bg-stone-950 py-16 text-stone-300 font-sans">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Contact Info and Map (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              
              <div className="flex flex-col gap-6">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">Indore Headquarters</h3>
                <p className="text-xs text-stone-400 leading-relaxed font-sans">
                  Mirrorwala showroom and manufacturing atelier are situated next to Dewas Naka. Clients are invited to inspect live LED brightness modules and wood composite moldings in person.
                </p>
              </div>

              {/* Info Items */}
              <div className="flex flex-col gap-4">
                
                <div className="flex items-start gap-4 p-4 rounded bg-stone-900/40 border border-stone-850">
                  <div className="p-3 bg-amber-400/10 text-amber-300 rounded">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Showroom Location</span>
                    <strong className="text-xs text-white mt-0.5 font-sans leading-relaxed">
                      Plot No 4, near Dewas Naka, Sector A, Industrial Area, Indore, MP - 452010
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded bg-stone-900/40 border border-stone-850">
                  <div className="p-3 bg-amber-400/10 text-amber-300 rounded">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Call Showroom</span>
                    <strong className="text-xs text-white mt-0.5 font-sans">+91 91112 56684 / +91 88714 04545</strong>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded bg-stone-900/40 border border-stone-850">
                  <div className="p-3 bg-amber-400/10 text-amber-300 rounded">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Email Enquiries</span>
                    <strong className="text-xs text-white mt-0.5 font-sans">sales@mirrorwala.in</strong>
                  </div>
                </div>

              </div>

              {/* Direct WhatsApp Trigger */}
              <div className="p-6 rounded border border-green-500/10 bg-green-500/5 flex flex-col gap-3">
                <h4 className="text-xs uppercase tracking-wider font-extrabold text-green-400 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> Live WhatsApp Atelier support
                </h4>
                <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
                  Have quick dimension sketches or structural architectural questions? Click below to chat directly with our Indore showroom director on WhatsApp.
                </p>
                <a
                  href="https://wa.me/919111256684?text=Hello%20Mirrorwala%2C%20I%20am%20interested%20in%20customizing%20a%20luxury%20mirror."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                  className="bg-green-600 hover:bg-green-500 text-stone-950 font-extrabold text-xs uppercase tracking-widest py-3 px-6 rounded transition-colors text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="h-4.5 w-4.5" /> Start WhatsApp Chat
                </a>
              </div>

            </div>

            {/* Right: Contact Form (7 Cols) */}
            <div className="lg:col-span-7 p-6 md:p-8 rounded bg-stone-900/40 border border-stone-850 shadow-2xl">
              {submitSuccess ? (
                <div className="text-center py-12 px-6 flex flex-col items-center gap-6">
                  <CheckCircle2 className="h-14 w-14 text-green-400 animate-bounce" />
                  <div className="flex flex-col gap-2">
                    <h3 className="font-serif text-2xl font-bold text-white">Message Transmitted!</h3>
                    <p className="text-xs text-stone-400 leading-relaxed font-sans">
                      Thank you. Your enquiry has been received at the showroom office. Our sales desk will verify your details and respond to your query shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-bold text-xs uppercase tracking-widest px-6 py-3 rounded"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
                    Transmit Showroom Enquiry
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 text-xs font-bold text-stone-400">
                      <span className="uppercase tracking-wider">Full Name</span>
                      <input
                        type="text"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="Your full name"
                        required
                        className="bg-stone-950 border border-stone-850 p-3 rounded text-white focus:outline-none focus:border-amber-400 text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 text-xs font-bold text-stone-400">
                      <span className="uppercase tracking-wider">Mobile Number</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="Your mobile phone"
                        required
                        className="bg-stone-950 border border-stone-850 p-3 rounded text-white focus:outline-none focus:border-amber-400 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 text-xs font-bold text-stone-400">
                    <span className="uppercase tracking-wider">Email Address</span>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Your email address"
                      required
                      className="bg-stone-950 border border-stone-850 p-3 rounded text-white focus:outline-none focus:border-amber-400 text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 text-xs font-bold text-stone-400">
                    <span className="uppercase tracking-wider">Subject</span>
                    <input
                      type="text"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      placeholder="How can our designers help?"
                      required
                      className="bg-stone-950 border border-stone-850 p-3 rounded text-white focus:outline-none focus:border-amber-400 text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 text-xs font-bold text-stone-400">
                    <span className="uppercase tracking-wider">Inquiry details message</span>
                    <textarea
                      rows={5}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Write your custom dimensions requirements or message here..."
                      required
                      className="bg-stone-950 border border-stone-850 p-3 rounded text-white focus:outline-none focus:border-amber-400 text-xs resize-none"
                    />
                  </div>

                  {submitError && (
                    <div className="text-red-400 text-xs font-bold p-3 bg-red-950/20 border border-red-950 rounded">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-extrabold text-xs uppercase tracking-widest py-3.5 px-6 rounded hover:from-white hover:to-amber-200 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Transmit Message</span>
                      </>
                    )}
                  </button>

                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
