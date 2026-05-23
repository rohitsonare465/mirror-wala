import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, "Full Name must be at least 2 characters long").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must not exceed 15 digits"),
  password: z.string().min(6, "Password must be at least 6 characters long").max(50),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters long").max(50),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long").max(50),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters long").max(50),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const addressValidationSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(150),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15),
  addressLine: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City name is required"),
  state: z.string().min(2, "State name is required"),
  country: z.string().min(2).default("India"),
  pincode: z.string().length(6, "Pincode must be exactly 6 digits"),
  isDefault: z.boolean().default(false),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type AddressInput = z.infer<typeof addressValidationSchema>;
