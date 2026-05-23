import { z } from 'zod';

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

// 1. Product Admin Validations
export const adminProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters").max(150),
  slug: z.string().min(2, "Product slug is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().max(300).optional().nullable(),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  price: z.number().positive("Base price must be a positive number"),
  salePrice: z.number().positive("Sale price must be a positive number").optional().nullable(),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  categoryId: objectIdSchema,
  featured: z.boolean().default(false),
  newArrival: z.boolean().default(true),
  images: z.array(z.string().url("Each image must be a valid Cloudinary URL")).min(1, "At least one product image is required"),
  LEDType: z.enum(['NONE', 'WARM_WHITE', 'NATURAL_WHITE', 'COOL_WHITE', 'TRI_COLOR', 'RGB']).default('NONE'),
  frameMaterial: z.string().max(100).optional().nullable(),
  dimensions: z.string().max(100).optional().nullable(),
});

// 2. Category Admin Validations
export const adminCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters").max(100),
  slug: z.string().min(2, "Category slug is required"),
  image: z.string().url("Banner must be a valid URL").optional().nullable(),
  description: z.string().max(500).optional().nullable(),
});

// 3. Coupon Admin Validations
export const couponSchema = z.object({
  code: z.string().min(3, "Coupon code must be at least 3 characters").max(20).toUpperCase(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.number().positive("Discount value must be positive"),
  minOrderValue: z.number().positive("Minimum order value must be positive").optional().nullable(),
  maxDiscount: z.number().positive("Maximum discount must be positive").optional().nullable(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid start date" }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid end date" }),
  isActive: z.boolean().default(true),
});

// 4. Homepage CMS Admin Validations
export const homepageContentSchema = z.object({
  key: z.string().min(2, "Key is required"),
  value: z.any(), // Accepts complex JSON payloads representing sliders, promo cards, or payment_settings
});

// Payment settings validation helper
export const paymentSettingsSchema = z.object({
  codEnabled: z.boolean(),
  maxCodAmount: z.number().positive("Max COD limit must be a positive number"),
});

// 5. SEO Admin Validations
export const seoSchema = z.object({
  title: z.string().min(1, "Meta title is required").max(70, "Meta title should be under 70 characters"),
  metaDescription: z.string().min(1, "Meta description is required").max(160, "Meta description should be under 160 characters"),
  keywords: z.array(z.string()).optional(),
  canonicalUrl: z.string().url("Must be a valid canonical URL").optional().nullable(),
  sitemapPriority: z.number().min(0).max(1).default(0.5),
});

// 6. Enquiry / Lead Admin Notes Validations
export const enquiryUpdateSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'QUOTED', 'CONVERTED', 'CLOSED']),
  adminNotes: z.string().max(2000).optional().nullable(),
  imageUrlReference: z.string().url("Reference image must be a valid URL").optional().nullable().or(z.literal("")),
});

// 7. Customer Toggles Validation
export const customerBlockStatusSchema = z.object({
  userId: objectIdSchema,
  blocked: z.boolean(),
});

export type AdminProductInput = z.infer<typeof adminProductSchema>;
export type AdminCategoryInput = z.infer<typeof adminCategorySchema>;
export type CouponInput = z.infer<typeof couponSchema>;
export type HomepageContentInput = z.infer<typeof homepageContentSchema>;
export type SeoInput = z.infer<typeof seoSchema>;
export type EnquiryUpdateInput = z.infer<typeof enquiryUpdateSchema>;
export type CustomerBlockStatusInput = z.infer<typeof customerBlockStatusSchema>;
