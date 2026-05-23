import React from 'react';
import prisma from '@/lib/prisma';
import ProductsClient from './ProductsClient';

export const revalidate = 0; // Fresh database fetches

export default async function ProductsPage() {
  // Query all products and categories
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <ProductsClient initialProducts={products} categories={categories} />
  );
}
