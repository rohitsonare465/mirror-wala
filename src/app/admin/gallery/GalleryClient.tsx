'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Image as ImageIcon, 
  Trash2, 
  X, 
  RefreshCw,
  Tag,
  Star
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { addGalleryImageAction, deleteGalleryImageAction } from '@/actions/admin';
import { useRouter } from 'next/navigation';
import FileUpload from '@/components/ui/FileUpload';

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  tags: string[];
  isFeatured: boolean;
  createdAt: string;
}

interface GalleryClientProps {
  initialGallery: GalleryItem[];
}

export default function GalleryClient({ initialGallery }: GalleryClientProps) {
  const router = useRouter();
  const toast = useToast();
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    tagsString: '',
    isFeatured: false,
  });

  const handleOpenAddModal = () => {
    setFormData({
      title: '',
      imageUrl: '',
      tagsString: 'LED Mirror, Luxury, Backlit, Vanity',
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.imageUrl.trim() || !formData.imageUrl.startsWith('http')) {
        throw new Error('Please specify a valid image web URL starting with http/https');
      }

      // Parse tags
      const tags = formData.tagsString
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      await addGalleryImageAction(
        formData.title.trim(),
        formData.imageUrl.trim(),
        tags,
        formData.isFeatured
      );

      toast.success(`Showroom image "${formData.title}" added successfully.`, 'Gallery Item Added');
      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Verification failure. Please correct fields.', 'Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = async (item: GalleryItem) => {
    if (!confirm(`Are you sure you want to delete showroom image "${item.title}"?`)) return;

    setDeletingId(item.id);
    try {
      await deleteGalleryImageAction(item.id);
      toast.success(`Showroom image "${item.title}" deleted successfully.`, 'Gallery Item Removed');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed.', 'Database Error');
    } finally {
      setDeletingId(null);
    }
  };


  return (
    <div className="flex flex-col gap-6">
      
      {/* Controls header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-amber-300 font-extrabold font-sans">Brand Portfolios</span>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">Showroom Gallery Showcase</h1>
          <p className="text-xs text-stone-400 mt-0.5">Manage premium design installations, customer project pictures, and featured lookbook portfolios.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-extrabold uppercase tracking-widest text-[10px] py-3.5 px-6 rounded-md hover:from-white hover:to-amber-200 transition-all duration-300 cursor-pointer shadow-lg shadow-amber-400/5"
        >
          <Plus className="h-4 w-4" /> Add Showcase Item
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialGallery.length === 0 ? (
          <div className="col-span-full bg-stone-900 border border-stone-850 p-16 rounded-md text-center text-stone-500 font-sans">
            No gallery showcase items currently configured. Click "Add Showcase Item" to start.
          </div>
        ) : (
          initialGallery.map(item => (
            <div 
              key={item.id} 
              className="bg-stone-900 border border-stone-850 rounded-md shadow-xl overflow-hidden flex flex-col justify-between group hover:border-amber-400/30 transition-all duration-300 relative"
            >
              {/* Showroom Image */}
              <div className="h-56 bg-stone-950 border-b border-stone-850 overflow-hidden flex items-center justify-center text-stone-600 relative">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" 
                />
                
                {/* Featured Badge */}
                {item.isFeatured && (
                  <div className="absolute top-3 left-3 bg-amber-400 text-stone-950 font-extrabold px-2.5 py-1 rounded text-[8px] font-sans uppercase tracking-widest flex items-center gap-1 shadow shadow-amber-400/20">
                    <Star className="h-3 w-3 fill-stone-950" /> Featured Showcase
                  </div>
                )}
              </div>

              {/* Content body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-white tracking-wider leading-snug">
                    {item.title}
                  </h3>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3 select-none">
                    {item.tags.map((tag, i) => (
                      <span 
                        key={i} 
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-stone-950 border border-stone-850/80 text-stone-400 text-[9px] font-mono"
                      >
                        <Tag className="h-2.5 w-2.5 text-stone-500" /> {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Grid actions */}
                <div className="flex justify-between items-center mt-5 pt-3 border-t border-stone-850/60 select-none">
                  <span className="text-[9px] text-stone-500 font-mono">
                    Added: {new Date(item.createdAt).toLocaleDateString(undefined, { dateStyle: 'short' })}
                  </span>
                  <button
                    onClick={() => handleDeleteClick(item)}
                    disabled={deletingId === item.id}
                    className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-extrabold text-stone-400 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    {deletingId === item.id ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="h-3.5 w-3.5" /> Remove Item
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Showcase Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-stone-900 border border-stone-850 rounded shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-850 flex justify-between items-center select-none bg-stone-950/40">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-amber-300" />
                <h3 className="font-serif text-lg font-bold text-white">Add Gallery Showroom Image</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form body */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Showcase Title *</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Royal Backlit Organic Mirror Dressing Setup"
                  className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <FileUpload
                  label="Showroom Image *"
                  value={formData.imageUrl}
                  onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                  folder="mirrorwala/gallery"
                  multiple={false}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Search Tags (separated by comma)</label>
                <input
                  type="text"
                  value={formData.tagsString}
                  onChange={(e) => setFormData(prev => ({ ...prev, tagsString: e.target.value }))}
                  placeholder="e.g. LED Mirror, Luxury, Backlit, Vanity"
                  className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none font-sans"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 select-none">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="rounded border-stone-800 bg-stone-950 text-amber-500 focus:ring-amber-500 h-4 w-4"
                />
                <label htmlFor="isFeatured" className="text-[10px] uppercase tracking-wider text-stone-400 font-extrabold cursor-pointer flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400/10" /> Pin on Featured Showroom Row
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
                onClick={handleFormSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-extrabold uppercase tracking-widest text-[10px] py-3 px-6 rounded-md hover:from-white hover:to-amber-200 disabled:opacity-50 transition-all duration-300 cursor-pointer shadow-lg shadow-amber-400/5"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> adding setup...
                  </>
                ) : (
                  'Deploy Showcase Setup'
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
