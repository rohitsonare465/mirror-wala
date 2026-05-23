'use client';

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Layers, 
  ArrowUpDown, 
  X, 
  Check, 
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { 
  createProductAction, 
  updateProductAction, 
  deleteProductAction 
} from '@/actions/admin';
import { useRouter } from 'next/navigation';
import FileUpload from '@/components/ui/FileUpload';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  salePrice: number | null;
  stock: number;
  categoryId: string;
  featured: boolean;
  newArrival: boolean;
  images: string[];
  LEDType: string;
  frameMaterial: string | null;
  dimensions: string | null;
  description: string;
  shortDescription: string | null;
  createdAt?: string | Date;
  category?: Category;
}

interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductsClient({ initialProducts, categories }: ProductsClientProps) {
  const router = useRouter();
  const toast = useToast();
  
  // Search & Filtering States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFeature, setSelectedFeature] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    description: '',
    shortDescription: '',
    price: '',
    salePrice: '',
    stock: '10',
    categoryId: categories[0]?.id || '',
    featured: false,
    newArrival: true,
    images: [] as string[],
    LEDType: 'NONE',
    frameMaterial: 'Aluminum Frame',
    dimensions: '600x800mm',
  });

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              product.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
        const matchesFeature = selectedFeature === 'all' || 
                              (selectedFeature === 'featured' && product.featured) ||
                              (selectedFeature === 'newArrival' && product.newArrival);
        return matchesSearch && matchesCategory && matchesFeature;
      })
      .sort((a, b) => {
        let valA: any = a[sortBy];
        let valB: any = b[sortBy];
        
        if (sortBy === 'price') {
          valA = a.salePrice || a.price;
          valB = b.salePrice || b.price;
        }

        if (typeof valA === 'string') {
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      });
  }, [initialProducts, searchTerm, selectedCategory, selectedFeature, sortBy, sortOrder]);

  // Page Calculations
  const totalPages = Math.max(Math.ceil(filteredProducts.length / itemsPerPage), 1);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Auto-slug generator helper
  const handleNameChange = (name: string) => {
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-');
      
    const generatedSku = `MW-${name.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    setFormData(prev => ({
      ...prev,
      name,
      slug: generatedSlug,
      sku: prev.sku || generatedSku
    }));
  };

  // Open Modal for Add
  const handleAddClick = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      sku: '',
      description: '',
      shortDescription: '',
      price: '',
      salePrice: '',
      stock: '10',
      categoryId: categories[0]?.id || '',
      featured: false,
      newArrival: true,
      images: [],
      LEDType: 'NONE',
      frameMaterial: 'Aluminum Frame',
      dimensions: '600x800mm',
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      description: product.description,
      shortDescription: product.shortDescription || '',
      price: String(product.price),
      salePrice: product.salePrice ? String(product.salePrice) : '',
      stock: String(product.stock),
      categoryId: product.categoryId,
      featured: product.featured,
      newArrival: product.newArrival,
      images: product.images,
      LEDType: product.LEDType,
      frameMaterial: product.frameMaterial || '',
      dimensions: product.dimensions || '',
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
        sku: formData.sku,
        description: formData.description,
        shortDescription: formData.shortDescription || null,
        price: Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : null,
        stock: Number(formData.stock),
        categoryId: formData.categoryId,
        featured: formData.featured,
        newArrival: formData.newArrival,
        images: formData.images,
        LEDType: formData.LEDType as any,
        frameMaterial: formData.frameMaterial || null,
        dimensions: formData.dimensions || null,
      };

      if (editingProduct) {
        await updateProductAction(editingProduct.id, payload);
        toast.success(`Successfully updated ${formData.name}`, 'Product Updated');
      } else {
        await createProductAction(payload);
        toast.success(`Successfully created ${formData.name}`, 'Product Created');
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Validation error. Please verify input data.', 'Database Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete product action
  const handleDeleteClick = async (product: Product) => {
    if (!confirm(`Are you absolutely sure you want to delete "${product.name}"?`)) return;

    try {
      await deleteProductAction(product.id);
      toast.success(`${product.name} deleted successfully.`, 'Product Removed');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Could not complete deletion.', 'Error');
    }
  };

  // Toggling tag helpers directly from table
  const handleToggleTag = async (product: Product, tag: 'featured' | 'newArrival') => {
    try {
      const nextValue = !product[tag];
      await updateProductAction(product.id, { [tag]: nextValue });
      toast.success(`${product.name} updated successfully.`, 'Tag Toggled');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed.');
    }
  };



  return (
    <div className="flex flex-col gap-6">
      
      {/* Controls header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-amber-300 font-extrabold font-sans">Brand Assets</span>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">Catalog Mirrors</h1>
          <p className="text-xs text-stone-400 mt-0.5">Control pricing, specifications, sizes and high-res media galleries.</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-950 font-extrabold uppercase tracking-widest text-[10px] py-3.5 px-6 rounded-md hover:from-white hover:to-amber-200 transition-all duration-300 cursor-pointer shadow-lg shadow-amber-400/5"
        >
          <Plus className="h-4 w-4" /> Add Premium Design
        </button>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="bg-stone-900 border border-stone-850 p-4 rounded-md shadow-xl flex flex-col md:flex-row items-center gap-4">
        
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, SKU, or organic design type..."
            className="w-full bg-stone-950 border border-stone-800 rounded p-3 pl-10 text-xs text-stone-200 focus:border-amber-500 outline-none"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-300 focus:border-amber-500 outline-none cursor-pointer"
          >
            <option value="all">All Collections</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={selectedFeature}
            onChange={(e) => setSelectedFeature(e.target.value)}
            className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-300 focus:border-amber-500 outline-none cursor-pointer"
          >
            <option value="all">All Tag Types</option>
            <option value="featured">Featured Only</option>
            <option value="newArrival">New Arrivals Only</option>
          </select>

          <button
            onClick={() => {
              setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
            }}
            className="p-3 bg-stone-950 border border-stone-850 rounded text-stone-300 hover:text-amber-300 transition-colors flex items-center gap-1.5 text-xs"
          >
            <ArrowUpDown className="h-4 w-4" />
            <span className="text-[10px] uppercase tracking-wider font-extrabold">{sortOrder}</span>
          </button>
        </div>

      </div>

      {/* Database Catalog Table */}
      <div className="bg-stone-900 border border-stone-850 rounded-md shadow-xl overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-16 text-center text-stone-500 text-xs">
            No premium designs matched your active search filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-950 border-b border-stone-850 text-[9px] uppercase tracking-widest text-stone-500 font-extrabold">
                  <th className="p-4 pl-6">Design Identity</th>
                  <th className="p-4">SKU / Model</th>
                  <th className="p-4">Collection</th>
                  <th className="p-4">Valuation (INR)</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-center">Badges</th>
                  <th className="p-4 text-right pr-6">Atelier Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-850/50 text-xs">
                {paginatedProducts.map(product => (
                  <tr key={product.id} className="hover:bg-stone-850/10 transition-colors">
                    {/* Design Identity */}
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <div className="h-11 w-11 rounded bg-stone-950 border border-stone-800 overflow-hidden flex items-center justify-center text-stone-600 flex-shrink-0 relative">
                        {product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full" />
                        ) : (
                          <ImageIcon className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <span className="font-serif font-black text-white hover:text-amber-300 cursor-pointer text-sm block" onClick={() => handleEditClick(product)}>
                          {product.name}
                        </span>
                        <span className="text-[10px] text-stone-500 truncate max-w-[200px] block mt-0.5">{product.dimensions || 'Custom Size'}</span>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="p-4 font-mono text-stone-300 tracking-wider text-[11px] font-bold">
                      {product.sku}
                    </td>

                    {/* Category */}
                    <td className="p-4 text-stone-400">
                      <span className="bg-stone-950 border border-stone-850/60 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider">
                        {product.category?.name || 'Unassigned'}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="p-4 font-mono font-bold text-stone-200">
                      {product.salePrice ? (
                        <div className="flex flex-col">
                          <span className="text-amber-300">₹{product.salePrice}</span>
                          <span className="text-[10px] line-through text-stone-600">₹{product.price}</span>
                        </div>
                      ) : (
                        <span>₹{product.price}</span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="p-4 font-mono text-stone-300">
                      <span className={`font-bold ${product.stock < 5 ? 'text-red-400' : 'text-stone-400'}`}>
                        {product.stock} units
                      </span>
                    </td>

                    {/* Badges / Toggles */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleToggleTag(product, 'featured')}
                          className={`px-2 py-0.5 text-[9px] uppercase tracking-widest font-black rounded border cursor-pointer select-none transition-colors ${
                            product.featured
                              ? 'bg-amber-400/10 text-amber-300 border-amber-400/40'
                              : 'bg-transparent text-stone-600 border-stone-800 hover:text-stone-300'
                          }`}
                          title="Featured Mirror toggle"
                        >
                          Featured
                        </button>
                        <button
                          onClick={() => handleToggleTag(product, 'newArrival')}
                          className={`px-2 py-0.5 text-[9px] uppercase tracking-widest font-black rounded border cursor-pointer select-none transition-colors ${
                            product.newArrival
                              ? 'bg-blue-400/10 text-blue-300 border-blue-400/40'
                              : 'bg-transparent text-stone-600 border-stone-800 hover:text-stone-300'
                          }`}
                          title="New Arrival toggle"
                        >
                          New
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="p-2 bg-stone-950 border border-stone-800 text-stone-400 hover:text-amber-300 hover:border-amber-400/30 rounded transition-all cursor-pointer"
                          title="Edit specifications"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="p-2 bg-stone-950 border border-stone-800 text-stone-400 hover:text-red-400 hover:border-red-900/30 rounded transition-all cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="p-4 bg-stone-950 border-t border-stone-850 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-stone-500 font-extrabold">
              Showing page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-2 bg-stone-900 border border-stone-800 rounded text-stone-400 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-2 bg-stone-900 border border-stone-800 rounded text-stone-400 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Creation and Edit modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-3xl w-full bg-stone-900 border border-stone-850 rounded shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-850 flex justify-between items-center select-none bg-stone-950/40">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-amber-300" />
                <h3 className="font-serif text-lg font-bold text-white">
                  {editingProduct ? `Modify: ${editingProduct.name}` : 'Add New Premium Mirror Design'}
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
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Row 1: Name and Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Design Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. RoyalFacets Wavy Oval Mirror"
                    className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Slug URL Identifier *</label>
                  <input
                    required
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="e.g. royalfacets-wavy-oval-mirror"
                    className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Row 2: SKU and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">SKU Reference Code *</label>
                  <input
                    required
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    placeholder="MW-LED-ROYAL"
                    className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none font-mono uppercase"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Collection Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                    className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-300 focus:border-amber-500 outline-none cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Prices and Stock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Base Price (INR) *</label>
                  <input
                    required
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="e.g. 35000"
                    className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Sale Price (Optional)</label>
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, salePrice: e.target.value }))}
                    placeholder="e.g. 29999"
                    className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Stock Quantity *</label>
                  <input
                    required
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    placeholder="10"
                    className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Row 4: Custom specifications */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Integrated LED Colors</label>
                  <select
                    value={formData.LEDType}
                    onChange={(e) => setFormData(prev => ({ ...prev, LEDType: e.target.value }))}
                    className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-300 focus:border-amber-500 outline-none cursor-pointer font-mono"
                  >
                    <option value="NONE">None</option>
                    <option value="WARM_WHITE">Warm White</option>
                    <option value="NATURAL_WHITE">Natural White</option>
                    <option value="COOL_WHITE">Cool White</option>
                    <option value="TRI_COLOR">Tri Color Dimmable</option>
                    <option value="RGB">RGB Multi Color</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Frame Materials</label>
                  <input
                    type="text"
                    value={formData.frameMaterial}
                    onChange={(e) => setFormData(prev => ({ ...prev, frameMaterial: e.target.value }))}
                    placeholder="e.g. Brushed Champagne Gold Composite"
                    className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Default Dimensions (bounds)</label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                    placeholder="e.g. 700mm x 1200mm"
                    className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Row 5: Showcase Image Cloudinary Uploader */}
              <div className="flex flex-col gap-2">
                <FileUpload
                  value={formData.images}
                  onChange={(images) => setFormData(prev => ({ ...prev, images }))}
                  multiple
                  folder="mirrorwala/products"
                  label="Mirror Showcase Images *"
                  maxFiles={6}
                />
              </div>

              {/* Row 6: Descriptions */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Short Marketing Intro (Max 300 Chars)</label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                    placeholder="A beautiful irregular curvy outline highlighted with faceted high-CRI led panels..."
                    className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold">Detailed Brand Specifications Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the mirror design, handcraft quality details, composite backing, mirror silver thickness and integrated smart demisters..."
                    className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-200 focus:border-amber-500 outline-none resize-none font-sans"
                  />
                </div>
              </div>

              {/* Row 7: Flags */}
              <div className="flex flex-wrap items-center gap-6 pt-2 select-none">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-black text-white uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="h-4 w-4 rounded accent-amber-400 bg-stone-950 border-stone-800"
                  />
                  Highlight in Featured Section
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-black text-white uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={formData.newArrival}
                    onChange={(e) => setFormData(prev => ({ ...prev, newArrival: e.target.checked }))}
                    className="h-4 w-4 rounded accent-amber-400 bg-stone-950 border-stone-800"
                  />
                  Mark as New Arrival Design
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
                Close Spec Modal
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
                  'Commit Specs to Database'
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
