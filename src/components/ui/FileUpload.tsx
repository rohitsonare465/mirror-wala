'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, Loader2, Trash2, Eye } from 'lucide-react';
import { useToast } from './Toast';

interface FileUploadProps {
  value: string | string[];
  onChange: (value: any) => void;
  multiple?: boolean;
  folder: 'mirrorwala/products' | 'mirrorwala/gallery' | 'mirrorwala/banners' | 'mirrorwala/testimonials';
  maxFiles?: number;
  label?: string;
  className?: string;
}

export default function FileUpload({
  value,
  onChange,
  multiple = false,
  folder,
  maxFiles = 6,
  label,
  className = '',
}: FileUploadProps) {
  const toast = useToast();
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize string/array values into an array
  const urls = Array.isArray(value)
    ? value.filter(Boolean)
    : typeof value === 'string' && value
    ? [value]
    : [];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const uploadFile = async (file: File) => {
    const tempId = `${file.name}-${Date.now()}`;
    setUploading((prev) => ({ ...prev, [tempId]: true }));

    try {
      // 1. Client-side mime type validation
      if (!file.type.startsWith('image/')) {
        toast.error('Only image file uploads are supported.', 'Format Disallowed');
        return;
      }

      // 2. Client-side size validation (max 10MB)
      const MAX_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        toast.error('Images must be smaller than 10MB.', 'Size Limit Exceeded');
        return;
      }

      // 3. Prepare FormData payload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      // 4. Send upload API call
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Upload operation failed');
      }

      // 5. Update state
      if (multiple) {
        const nextUrls = [...urls, result.url];
        if (nextUrls.length > maxFiles) {
          toast.error(`You have reached the maximum allowed count of ${maxFiles} images.`, 'Count Limit');
          return;
        }
        onChange(nextUrls);
      } else {
        onChange(result.url);
      }

      toast.success(`"${file.name}" successfully uploaded to Cloudinary.`, 'Asset Uploaded');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Image could not be uploaded.', 'Network Error');
    } finally {
      setUploading((prev) => {
        const next = { ...prev };
        delete next[tempId];
        return next;
      });
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      if (!multiple && files.length > 1) {
        toast.error('Only a single image upload is permitted here.', 'Limit Exceeded');
        await uploadFile(files[0]);
        return;
      }

      for (const file of files) {
        await uploadFile(file);
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      if (!multiple && files.length > 1) {
        toast.error('Only a single image upload is permitted here.', 'Limit Exceeded');
        await uploadFile(files[0]);
        return;
      }

      for (const file of files) {
        await uploadFile(file);
      }
    }
  };

  const handleDelete = async (urlToDelete: string) => {
    try {
      // Fast local UX update
      const nextUrls = urls.filter((url) => url !== urlToDelete);
      if (multiple) {
        onChange(nextUrls);
      } else {
        onChange('');
      }

      // Async backend purge
      const response = await fetch('/api/admin/upload/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToDelete }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        console.warn('Failed to delete asset from Cloudinary:', result.error);
        // Do not rollback local state because the asset is already detached from the DB record
      } else {
        toast.success('Asset safely deleted from cloud storage.', 'Asset Purged');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <span className="text-[9px] uppercase tracking-wider text-stone-500 font-extrabold block">
          {label}
        </span>
      )}

      {/* Uploaded thumbnails preview grid */}
      {urls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {urls.map((url, idx) => (
            <div
              key={url}
              className="group relative h-28 rounded bg-stone-950 border border-stone-850 overflow-hidden flex items-center justify-center text-stone-600 transition-all duration-300 hover:border-amber-500/30"
            >
              <img
                src={url}
                alt={`Mirrorwala upload preview ${idx + 1}`}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />

              {/* Glassmorphic options overlay on hover */}
              <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center gap-2 select-none">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-stone-900/80 border border-stone-800 text-stone-300 hover:text-white rounded transition-colors"
                  title="View full image"
                >
                  <Eye className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={() => handleDelete(url)}
                  className="p-2 bg-stone-900/80 border border-stone-800 text-stone-400 hover:text-red-400 rounded transition-colors cursor-pointer"
                  title="Delete image asset"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Thumbnail numbering for multiple files */}
              {multiple && (
                <div className="absolute top-2 left-2 bg-stone-950/80 backdrop-blur-sm border border-stone-800 px-1.5 py-0.5 rounded text-[8px] font-extrabold text-amber-300 uppercase tracking-widest font-mono select-none">
                  #{idx + 1}
                </div>
              )}
            </div>
          ))}

          {/* Upload progress items */}
          {Object.keys(uploading).map((tempId) => (
            <div
              key={tempId}
              className="relative h-28 rounded bg-stone-950/40 border border-stone-850/60 overflow-hidden flex flex-col items-center justify-center text-stone-600 animate-pulse select-none"
            >
              <Loader2 className="h-5 w-5 text-amber-300 animate-spin mb-1.5" />
              <span className="text-[8px] font-sans font-bold text-stone-450 uppercase tracking-widest">
                Uploading...
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Drag & Drop interactive zone */}
      {(!multiple && urls.length === 0) || (multiple && urls.length < maxFiles) ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border border-dashed rounded p-6 text-center transition-all duration-300 cursor-pointer select-none relative group ${
            isDragActive
              ? 'border-amber-400 bg-amber-400/5 shadow shadow-amber-400/5'
              : 'border-stone-800 bg-stone-900/40 hover:bg-stone-900/60 hover:border-stone-700'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple={multiple}
            accept="image/*"
            className="hidden"
          />

          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-stone-950 border border-stone-800 rounded-full text-stone-450 group-hover:text-amber-300 group-hover:border-amber-400/20 group-hover:scale-105 transition-all duration-300">
              <UploadCloud className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-stone-350 font-medium">
                {isDragActive ? 'Drop your files here' : 'Drag & drop image here or click to browse'}
              </p>
              <p className="text-[10px] text-stone-500 mt-1.5 leading-relaxed font-sans">
                Supports JPEG, PNG, WEBP, AVIF up to 10MB.<br />
                {multiple && `Maximum ${maxFiles - urls.length} remaining images allowed.`}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
