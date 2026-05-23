import { z } from 'zod';
import { objectIdSchema } from './product';

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(150),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15),
  email: z.string().email("Invalid email address"),
  addressLine: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City name is required"),
  state: z.string().min(2, "State name is required"),
  pincode: z.string().length(6, "Pincode must be exactly 6 digits"),
  country: z.string().min(2).default("India"),
});

export const cartItemSchema = z.object({
  id: z.string().optional(),
  productId: objectIdSchema,
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  customizationDetails: z.string().optional().nullable(),
});

export const checkoutValidationSchema = z.object({
  shippingAddressId: objectIdSchema.optional().nullable(),
  shippingAddress: shippingAddressSchema.optional().nullable(),
  items: z.array(cartItemSchema).min(1, "Your cart must contain at least one item"),
  paymentMethod: z.enum(['RAZORPAY', 'COD']),
  couponCode: z.string().optional().nullable(),
});

export const createCouponSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").max(20).toUpperCase(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.number().positive("Discount value must be positive"),
  minOrderValue: z.number().positive().optional().nullable(),
  maxDiscount: z.number().positive().optional().nullable(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  isActive: z.boolean().default(true),
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type CheckoutInput = z.infer<typeof checkoutValidationSchema>;
export type CreateCouponInput = z.infer<typeof createCouponSchema>;
