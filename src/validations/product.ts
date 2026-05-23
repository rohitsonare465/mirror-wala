import { z } from 'zod';

// MongoDB ObjectId validation regex helper (24 hex characters)
export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const createCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").max(100),
  slug: z.string().min(2, "Slug must be at least 2 characters long").max(100),
  image: z.string().url("Image must be a valid URL").optional().nullable(),
  description: z.string().max(500).optional().nullable(),
});

export const productVariantSchema = z.object({
  sku: z.string().min(3, "SKU is required"),
  width: z.number().int().positive("Width must be positive"),
  height: z.number().int().positive("Height must be positive"),
  price: z.number().positive("Price must be positive"),
  salePrice: z.number().positive().optional().nullable(),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  isActive: z.boolean().default(true),
});

export const createProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").max(150),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  shortDescription: z.string().optional().nullable(),
  sku: z.string().min(3, "SKU is required"),
  price: z.number().positive("Price must be positive"),
  salePrice: z.number().positive().optional().nullable(),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  categoryId: objectIdSchema,
  featured: z.boolean().default(false),
  newArrival: z.boolean().default(true),
  images: z.array(z.string().url("Each image must be a valid URL")),
  LEDType: z.enum(['NONE', 'WARM_WHITE', 'NATURAL_WHITE', 'COOL_WHITE', 'TRI_COLOR', 'RGB']).default('NONE'),
  frameMaterial: z.string().optional().nullable(),
  dimensions: z.string().optional().nullable(),
  variants: z.array(productVariantSchema).optional(),
});

export const createReviewSchema = z.object({
  productId: objectIdSchema,
  userId: objectIdSchema,
  rating: z.number().int().min(1, "Minimum rating is 1").max(5, "Maximum rating is 5"),
  title: z.string().max(100).optional().nullable(),
  comment: z.string().min(5, "Comment must be at least 5 characters long"),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type ProductVariantInput = z.infer<typeof productVariantSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
