import React from 'react';
import prisma from '@/lib/prisma';
import CategoriesClient from './CategoriesClient';

export const revalidate = 0; // Fresh database fetches

export default async function CategoriesPage() {
  // Query categories with their respective product count
  const categories = await prisma.category.findMany({
    include: {
      products: {
        select: { id: true }
      }
    },
    orderBy: {
      name: 'asc',
    },
  });

  // Map to include a simple count field
  const mappedCategories = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    image: cat.image,
    description: cat.description,
    productCount: cat.products.length,
  }));

  return (
    <CategoriesClient initialCategories={mappedCategories} />
  );
}
