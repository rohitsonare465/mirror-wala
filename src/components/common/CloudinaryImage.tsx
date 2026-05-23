'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface CloudinaryImageProps extends Omit<ImageProps, 'src' | 'quality'> {
  src: string;
  quality?: number | string;
  lowResPlaceholder?: boolean;
}

/**
 * Injects automated Cloudinary transformation parameters (f_auto, q_auto, dimensions)
 * right after the '/upload/' segment of the Cloudinary asset URL.
 */
export function getCloudinaryUrl(
  src: string,
  options: { width?: number; height?: number; quality?: number | string } = {}
): string {
  if (!src || !src.includes('res.cloudinary.com')) return src;

  const uploadSegment = '/upload/';
  const index = src.indexOf(uploadSegment);
  if (index === -1) return src;

  const transformParts = [];
  transformParts.push('f_auto'); // Auto format (AVIF/WebP)
  transformParts.push(`q_${options.quality || 'auto'}`); // Auto quality

  if (options.width) transformParts.push(`w_${options.width}`);
  if (options.height) transformParts.push(`h_${options.height}`);

  const transformString = transformParts.join(',');

  // Check if there is already a transformation segment right after /upload/ (i.e. not a version number like v123456789)
  const afterUpload = src.substring(index + uploadSegment.length);
  const nextSlashIndex = afterUpload.indexOf('/');
  
  if (nextSlashIndex !== -1) {
    const firstSegment = afterUpload.substring(0, nextSlashIndex);
    const isVersion = /^v\d+$/.test(firstSegment);
    if (!isVersion && firstSegment.includes('_')) {
      // Replace existing transformation segment with optimized ones
      return `${src.substring(0, index)}${uploadSegment}${transformString}/${afterUpload.substring(nextSlashIndex + 1)}`;
    }
  }

  return `${src.substring(0, index)}${uploadSegment}${transformString}/${afterUpload}`;
}

/**
 * A highly-optimized image component wrapper for Mirrorwala.
 * Integrates Cloudinary transformations, lazy loading, and elegant fade-in transitions.
 */
export default function CloudinaryImage({
  src,
  alt,
  width,
  height,
  fill,
  priority = false,
  className = '',
  quality = 'auto',
  lowResPlaceholder = true,
  ...rest
}: CloudinaryImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Generate optimized image URLs
  const optimizedSrc = getCloudinaryUrl(src, {
    width: width ? Number(width) : undefined,
    height: height ? Number(height) : undefined,
    quality,
  });

  // 2. Generate lightweight tiny placeholder URL if enabled
  const placeholderSrc = lowResPlaceholder
    ? getCloudinaryUrl(src, { width: 50, height: 50, quality: 30 })
    : undefined;

  // Determine transition styles based on load state
  const imageStyles = `transition-all duration-700 ease-in-out ${
    isLoaded ? 'scale-100 blur-0 grayscale-0' : 'scale-95 blur-md grayscale'
  } ${className}`;

  return (
    <div className="relative overflow-hidden w-full h-full bg-stone-900/40">
      <Image
        src={optimizedSrc}
        alt={alt || 'Mirrorwala Luxury Mirror'}
        width={width}
        height={height}
        fill={fill}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        onLoad={() => setIsLoaded(true)}
        className={`${imageStyles} object-cover`}
        placeholder={placeholderSrc && !priority ? 'blur' : undefined}
        blurDataURL={placeholderSrc && !priority ? placeholderSrc : undefined}
        {...rest}
      />
    </div>
  );
}
