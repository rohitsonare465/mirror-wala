'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  FolderTree, 
  Trash2, 
  Edit3, 
  X, 
  Image as ImageIcon,
  Sparkles,
  RefreshCw 
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { 
  createCategoryAction, 
  updateCategoryAction, 
  deleteCategoryAction 
} from '@/actions/admin';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
  productCount: number;
}

interface CategoriesClientProps {
  initialCategories: Category[];
}

export default function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const router = useRouter();
  const toast = useToast();
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
  });

  // Slug generator helper
  const handleNameChange = (name: string) => {
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-');

    setFormData(prev => ({
      ...prev,
      name,
      slug: generatedSlug,
    }));
  };

  // Open Modal for Add
  const handleAddClick = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '/images/designer_category.png',
    });
    setIsModalOpen(setIsModalOpen => true);
  };

  // Open Modal for Edit
  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image || '',
    });
    setIsModalOpen(true);
  };

  // Save changes
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        image: formData.image || null,
      };

      if (editingCategory) {
        await updateCategoryAction(editingCategory.id, payload);
        toast.success(`Successfully updated ${formData.name}`, 'Collection Updated');
      } else {
        await createCategoryAction(payload);
        toast.success(`Successfully created ${formData.name}`, 'Collection Created');
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Verification failure. Please correct form.', 'Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete category
  const handleDeleteClick = async (category: Category) => {
    if (category.productCount > 0) {
      toast.error(`Cannot delete a collection that currently contains active products (${category.productCount} products). Reassign the products first.`, 'Action Blocked');
      return;
    }

    if (!confirm(`Are you sure you want to delete the collection "${category.name}"?`)) return;

    try {
      await deleteCategoryAction(category.id);
      toast.success(`${category.name} collection successfully removed.`, 'Category Removed');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed.', 'Database Error');
    }
  };

  // Auto mock loader helper
  const handleLoadMockImage = () => {
    const mockBanners = [
      '/images/designer_category.png',
      '/images/before_room.png',
      '/images/after_room.png'
    ];
    const pickedBanner = mockBanners[Math.floor(Math.random() * mockBanners.length)];
    setFormData(prev => ({ ...prev, image: pickedBanner }));
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Controls header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-amber-300 font-extrabold font-sans">Brand Navigation</span>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">Mirror Collections</h1>
          <p className="text-xs text-stone-400 mt-0.5">Edit client showroom navigation, banners, and descriptions.</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-extrabold uppercase tracking-widest text-[10px] py-3.5 px-6 rounded-md hover:from-white hover:to-amber-200 transition-all duration-300 cursor-pointer shadow-lg shadow-amber-400/5"
        >
          <Plus className="h-4 w-4" /> Create Collection
        </button>
      </div>

      {/* Grid List displaying categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialCategories.map(category => (
          <div key={category.id} className="bg-stone-900 border border-stone-850 rounded-md shadow-xl overflow-hidden flex flex-col justify-between group hover:border-amber-400/30 transition-all duration-300 relative">
            
            {/* Category Banner image */}
            <div className="h-40 bg-stone-950 border-b border-stone-850 overflow-hidden flex items-center justify-center text-stone-600 relative">
              {category.image ? (
                <img src={category.image} alt={category.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <ImageIcon className="h-8 w-8" />
              )}
              <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-sm border border-stone-800/80 px-2.5 py-1 rounded text-[9px] font-extrabold uppercase tracking-widest text-amber-300">
                {category.productCount} Premium Designs
              </div>
            </div>

            {/* Content body */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-white tracking-wider">{category.name}</h3>
                <span className="text-[10px] text-stone-500 font-mono block mt-1">Slug: /collections/{category.slug}</span>
                <p className="text-xs text-stone-400 font-sans mt-3 leading-relaxed line-clamp-3">
                  {category.description || 'No descriptive overview details written for this luxury showroom category.'}
                </p>
              </div>

              {/* Grid actions */}
              <div className="flex justify-between items-center mt-5 pt-4 border-t border-stone-850/60">
                <button
                  onClick={() => handleEditClick(category)}
                  className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-extrabold text-stone-400 hover:text-white transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Adjust Spec
                </button>
                <button
                  onClick={() => handleDeleteClick(category)}
                  className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-extrabold text-stone-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Creation and Edit modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-stone-900 border border-stone-850 rounded shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-850 flex justify-between items-center select-none bg-stone-950/40">
              <div className="flex items-center gap-2">
                <FolderTree className="h-5 w-5 text-amber-300" />
                <h3 className="font-serif text-lg font-bold text-white">
                  {editingCategory ? `Modify Category: ${editingCategory.name}` : 'Create New Collection Category'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form body */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Collection Title *</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Dimmable Vanity LED Mirrors"
                  className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Slug URL Tag *</label>
                <input
                  required
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="e.g. dimmable-vanity-led-mirrors"
                  className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none font-mono"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center select-none">
                  <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Banner Image URL</label>
                  <button
                    type="button"
                    onClick={handleLoadMockImage}
                    className="text-amber-300 hover:text-white text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" /> Auto Mock Image
                  </button>
                </div>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="Paste banner image web URL"
                  className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-300 focus:border-amber-500 outline-none font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Collection Pitch Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide an overview description explaining the styling, design, backlit panels and smart systems of this category..."
                  className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none resize-none font-sans"
                />
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
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> saving specs...
                  </>
                ) : (
                  'Save Collection Specs'
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
