'use client';

import React, { useState } from 'react';
import { 
  Search, 
  MessageSquare, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Layers, 
  Maximize2, 
  X, 
  RefreshCw,
  NotebookText,
  Sliders,
  DollarSign,
  BookmarkCheck
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { updateEnquiryAction } from '@/actions/admin';
import { useRouter } from 'next/navigation';
import FileUpload from '@/components/ui/FileUpload';

interface Lead {
  id: string;
  type: 'GENERAL' | 'CUSTOM_QUOTE' | 'BULK_ORDER' | 'COLLABORATION';
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'QUOTED' | 'CONVERTED' | 'CLOSED';
  adminNotes: string | null;
  shape: string | null;
  width: number | null;
  height: number | null;
  thickness: number | null;
  edgeStyle: string | null;
  ledColor: string | null;
  features: string[];
  imageUrlReference: string | null;
  estimatedPrice: number | null;
  createdAt: string;
}

interface LeadsClientProps {
  initialLeads: Lead[];
}

export default function LeadsClient({ initialLeads }: LeadsClientProps) {
  const router = useRouter();
  const toast = useToast();
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Modal State
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [statusInput, setStatusInput] = useState<'NEW' | 'CONTACTED' | 'QUOTED' | 'CONVERTED' | 'CLOSED'>('NEW');
  const [imageUrlReferenceInput, setImageUrlReferenceInput] = useState<string | null>(null);

  const handleOpenLead = (lead: Lead) => {
    setActiveLead(lead);
    setAdminNotesInput(lead.adminNotes || '');
    setStatusInput(lead.status);
    setImageUrlReferenceInput(lead.imageUrlReference);
  };

  const handleUpdateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead) return;
    setIsSubmitting(true);

    try {
      await updateEnquiryAction(activeLead.id, {
        status: statusInput,
        adminNotes: adminNotesInput.trim() || null,
        imageUrlReference: imageUrlReferenceInput || null,
      });

      toast.success(
        `Lead specs and notes for ${activeLead.fullName} successfully saved.`,
        'Lead Updated'
      );
      
      // Update active lead display locally
      setActiveLead(prev => prev ? {
        ...prev,
        status: statusInput,
        adminNotes: adminNotesInput.trim() || null,
        imageUrlReference: imageUrlReferenceInput || null,
      } : null);

      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed.', 'Database Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter logic
  const filteredLeads = initialLeads.filter(lead => {
    const term = searchTerm.toLowerCase();
    const nameMatch = lead.fullName.toLowerCase().includes(term);
    const emailMatch = lead.email.toLowerCase().includes(term);
    const subjectMatch = lead.subject.toLowerCase().includes(term);
    const textMatch = nameMatch || emailMatch || subjectMatch;

    const statusMatch = statusFilter === 'ALL' || lead.status === statusFilter;
    const typeMatch = typeFilter === 'ALL' || lead.type === typeFilter;

    return textMatch && statusMatch && typeMatch;
  });

  const getStatusBadgeClass = (status: Lead['status']) => {
    switch (status) {
      case 'NEW':
        return 'bg-amber-400/10 border border-amber-400/20 text-amber-300';
      case 'CONTACTED':
        return 'bg-blue-400/10 border border-blue-400/20 text-blue-400';
      case 'QUOTED':
        return 'bg-purple-400/10 border border-purple-400/20 text-purple-400';
      case 'CONVERTED':
        return 'bg-green-400/10 border border-green-400/20 text-green-400';
      case 'CLOSED':
        return 'bg-stone-850 border border-stone-800 text-stone-500';
      default:
        return 'bg-stone-900 border border-stone-800 text-stone-400';
    }
  };

  const getTypeBadgeClass = (type: Lead['type']) => {
    switch (type) {
      case 'CUSTOM_QUOTE':
        return 'bg-gradient-to-r from-amber-400/15 to-yellow-500/10 border border-amber-400/20 text-amber-300';
      case 'BULK_ORDER':
        return 'bg-purple-950/40 border border-purple-900/30 text-purple-300';
      case 'COLLABORATION':
        return 'bg-pink-950/40 border border-pink-900/30 text-pink-300';
      default:
        return 'bg-stone-950 border border-stone-850 text-stone-400';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Controls header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-amber-300 font-extrabold font-sans">Business Relations</span>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">Custom Configuration Leads</h1>
          <p className="text-xs text-stone-400 mt-0.5">Review bespoke mirror design orders, collaboration applications, and track customer follow-up statuses.</p>
        </div>
      </div>

      {/* Filter and search panel */}
      <div className="bg-stone-900 border border-stone-850 p-4 rounded-md shadow-md flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
          <input
            type="text"
            placeholder="Search leads by client name, email, or subject description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded p-3 pl-10 text-xs text-stone-200 focus:border-amber-500 outline-none placeholder-stone-600 font-sans"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto self-stretch">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 md:flex-none bg-stone-950 border border-stone-800 rounded px-4 py-3 text-xs text-stone-300 focus:border-amber-500 outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUOTED">Quoted</option>
            <option value="CONVERTED">Converted</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="flex-1 md:flex-none bg-stone-950 border border-stone-800 rounded px-4 py-3 text-xs text-stone-300 focus:border-amber-500 outline-none"
          >
            <option value="ALL">All Lead Types</option>
            <option value="GENERAL">General Enquiry</option>
            <option value="CUSTOM_QUOTE">Custom Config Quote</option>
            <option value="BULK_ORDER">Bulk Order Query</option>
            <option value="COLLABORATION">Collaboration request</option>
          </select>
        </div>
      </div>

      {/* Main Leads Table */}
      <div className="bg-stone-900 border border-stone-850 rounded-md shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-stone-850 bg-stone-950/40 select-none text-[9px] uppercase tracking-wider text-stone-400 font-extrabold">
                <th className="p-4 pl-6">Sender Details</th>
                <th className="p-4">Lead Type</th>
                <th className="p-4">Subject & Pitch</th>
                <th className="p-4">Date Submitted</th>
                <th className="p-4">Progress State</th>
                <th className="p-4 text-right pr-6">Inspect Spec</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-850/60 font-sans text-xs">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-stone-500 font-sans">
                    No customer leads or inquiries found.
                  </td>
                </tr>
              ) : (
                filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-stone-850/20 transition-colors">
                    {/* User profile info */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full border border-stone-800 bg-stone-950 text-stone-300 flex items-center justify-center">
                          <User className="h-4 w-4 text-stone-400" />
                        </div>
                        <div>
                          <span className="font-serif text-sm font-bold text-white block">
                            {lead.fullName}
                          </span>
                          <span className="text-[10px] text-stone-500 block font-mono">Enquiry ID: {lead.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Lead Type */}
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest ${getTypeBadgeClass(lead.type)}`}>
                        {lead.type.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Subject */}
                    <td className="p-4 text-stone-300">
                      <div className="max-w-xs truncate font-serif font-bold text-stone-200">
                        {lead.subject}
                      </div>
                      <div className="max-w-xs truncate text-[11px] text-stone-500 mt-0.5">
                        {lead.message}
                      </div>
                    </td>

                    {/* Date submitted */}
                    <td className="p-4 text-stone-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-stone-600" />
                        <span>{new Date(lead.createdAt).toLocaleDateString('default', { dateStyle: 'medium' })}</span>
                      </div>
                    </td>

                    {/* Progress State */}
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest ${getStatusBadgeClass(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="p-4 text-right pr-6">
                      <button
                        onClick={() => handleOpenLead(lead)}
                        className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-extrabold text-stone-400 hover:text-amber-300 border border-stone-800 bg-stone-950 px-3.5 py-2 rounded-sm hover:border-amber-400/20 transition-all cursor-pointer"
                      >
                        <NotebookText className="h-3.5 w-3.5" /> Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Lead Inspector Modal */}
      {activeLead && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-stone-900 border border-stone-850 rounded shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-850 flex justify-between items-center select-none bg-stone-950/40">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-amber-300" />
                <h3 className="font-serif text-lg font-bold text-white">
                  Lead Inspector & Log Details
                </h3>
              </div>
              <button
                onClick={() => setActiveLead(null)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Container */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 font-sans">
              
              {/* Profile details */}
              <div className="grid grid-cols-2 gap-4 bg-stone-950 p-4 border border-stone-850/80 rounded-md">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Client Contact Name</span>
                  <div className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-stone-500" /> {activeLead.fullName}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Date Submitted</span>
                  <div className="text-xs text-stone-300 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-stone-550" /> {new Date(activeLead.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>

                <div className="space-y-1 mt-2">
                  <span className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Email Address</span>
                  <div className="text-xs text-stone-355 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-stone-500" /> {activeLead.email}
                  </div>
                </div>

                <div className="space-y-1 mt-2">
                  <span className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Phone Number</span>
                  <div className="text-xs text-stone-300 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-stone-500" /> {activeLead.phone}
                  </div>
                </div>
              </div>

              {/* Bespoke configurator setup details */}
              {activeLead.type === 'CUSTOM_QUOTE' && (
                <div className="border border-amber-400/20 bg-gradient-to-br from-amber-400/5 to-transparent rounded p-5 space-y-4">
                  <div className="flex items-center gap-2 select-none border-b border-amber-400/10 pb-2">
                    <Sliders className="h-4 w-4 text-amber-300" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">Bespoke Design Specifications</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-xs text-stone-300">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Requested Shape</div>
                      <div className="font-bold text-white mt-0.5">{activeLead.shape || 'N/A'}</div>
                    </div>

                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Custom Size (W x H)</div>
                      <div className="font-mono text-white mt-0.5 font-bold">
                        {activeLead.width && activeLead.height 
                          ? `${activeLead.width}mm x ${activeLead.height}mm` 
                          : 'N/A'
                        }
                      </div>
                    </div>

                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Glass Thickness</div>
                      <div className="font-mono text-white mt-0.5 font-bold">
                        {activeLead.thickness ? `${activeLead.thickness} mm` : 'N/A'}
                      </div>
                    </div>

                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Glass Edge-Work</div>
                      <div className="font-bold text-white mt-0.5">{activeLead.edgeStyle || 'N/A'}</div>
                    </div>

                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">LED Light Trim</div>
                      <div className="font-bold text-white mt-0.5">{activeLead.ledColor || 'N/A'}</div>
                    </div>

                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Estimated Value</div>
                      <div className="font-mono text-amber-300 mt-0.5 font-extrabold flex items-center">
                        <DollarSign className="h-3 w-3" /> {activeLead.estimatedPrice ? activeLead.estimatedPrice.toLocaleString() : 'Pending calculation'}
                      </div>
                    </div>
                  </div>

                  {activeLead.features && activeLead.features.length > 0 && (
                    <div className="pt-2 border-t border-amber-400/5">
                      <div className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold mb-1.5">Integrated Smart Options</div>
                      <div className="flex flex-wrap gap-1.5">
                        {activeLead.features.map((feat, idx) => (
                          <span key={idx} className="bg-stone-950 border border-stone-850 px-2.5 py-0.5 rounded-sm text-[10px] text-stone-300 font-mono">
                            {feat.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeLead.imageUrlReference && (
                    <div className="pt-3 border-t border-amber-400/10 flex flex-col gap-2">
                      <div className="text-[9px] uppercase tracking-wider text-amber-300/60 font-extrabold">Active Technical Layout / Reference</div>
                      <div className="relative h-44 rounded bg-stone-950 border border-stone-850 overflow-hidden group max-w-sm">
                        <img 
                          src={activeLead.imageUrlReference} 
                          alt="Bespoke mirror drawing layout" 
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a 
                            href={activeLead.imageUrlReference} 
                            target="_blank" 
                            rel="noreferrer"
                            className="bg-stone-900 border border-stone-850 text-white font-bold uppercase tracking-wider text-[9px] px-3.5 py-2 rounded flex items-center gap-1.5 hover:border-amber-400/20 transition-colors"
                          >
                            <Maximize2 className="h-3.5 w-3.5 text-amber-300" /> Fullscreen Layout
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Message Details */}
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Lead Subject & Title</span>
                <div className="font-serif font-bold text-sm text-stone-200">{activeLead.subject}</div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Customer Message Pitch</span>
                <div className="bg-stone-950 border border-stone-850 rounded p-4 text-xs text-stone-300 leading-relaxed font-sans whitespace-pre-wrap">
                  {activeLead.message || 'No additional text message submitted.'}
                </div>
              </div>

              {/* Edit log form */}
              <form onSubmit={handleUpdateLead} className="border-t border-stone-850/60 pt-5 space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Update Status</label>
                    <select
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value as any)}
                      className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none"
                    >
                      <option value="NEW">NEW (Awaiting review)</option>
                      <option value="CONTACTED">CONTACTED (Followed up)</option>
                      <option value="QUOTED">QUOTED (Priced drafted)</option>
                      <option value="CONVERTED">CONVERTED (Order created)</option>
                      <option value="CLOSED">CLOSED (No conversion/spam)</option>
                    </select>
                  </div>
                </div>

                {activeLead.type === 'CUSTOM_QUOTE' && (
                  <div className="flex flex-col gap-1.5 pt-2">
                    <FileUpload
                      label="Bespoke Design Schematic / Reference Photo"
                      value={imageUrlReferenceInput || ''}
                      onChange={(url) => setImageUrlReferenceInput(url)}
                      folder="mirrorwala/products"
                      multiple={false}
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Admin Log Notes (History tracking / feedback)</label>
                  <textarea
                    rows={4}
                    value={adminNotesInput}
                    onChange={(e) => setAdminNotesInput(e.target.value)}
                    placeholder="Enter call history details, negotiated custom dimension price, sent layouts, etc..."
                    className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-250 focus:border-amber-500 outline-none resize-none font-sans"
                  />
                </div>

              </form>

            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-stone-850 bg-stone-950/60 flex items-center justify-end gap-3 select-none">
              <button
                type="button"
                onClick={() => setActiveLead(null)}
                className="bg-stone-850 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 text-[10px] font-extrabold uppercase tracking-widest py-3 px-6 rounded-md transition-colors cursor-pointer"
              >
                Close Dialog
              </button>
              <button
                onClick={handleUpdateLead}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-extrabold uppercase tracking-widest text-[10px] py-3 px-6 rounded-md hover:from-white hover:to-amber-200 disabled:opacity-50 transition-all duration-300 cursor-pointer shadow-lg shadow-amber-400/5"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> saving lead...
                  </>
                ) : (
                  <>
                    <BookmarkCheck className="h-3.5 w-3.5" /> Save Changes & Notes
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
