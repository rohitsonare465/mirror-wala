import React from 'react';
import { AdminService } from '@/services/admin.service';
import GalleryClient from './GalleryClient';

export const revalidate = 0; // Fresh database fetches

export default async function GalleryPage() {
  const gallery = await AdminService.listGallery();

  // Next.js client components can accept serializable objects, serialize dates if needed.
  const serializedGallery = gallery.map(g => ({
    ...g,
    createdAt: g.createdAt.toISOString(),
    updatedAt: g.updatedAt.toISOString(),
  }));

  return (
    <GalleryClient initialGallery={serializedGallery} />
  );
}
