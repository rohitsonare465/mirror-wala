'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { AdminService } from '@/services/admin.service';
import { 
  AdminProductInput, 
  AdminCategoryInput, 
  CouponInput, 
  SeoInput, 
  EnquiryUpdateInput, 
  adminProductSchema, 
  adminCategorySchema, 
  couponSchema, 
  seoSchema, 
  enquiryUpdateSchema 
} from '@/validations/admin';

// Helper to assert admin privilege on server actions
async function assertAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required');
  }

  return session;
}

/**
 * Retrieves aggregate operational dashboard metrics for administrators
 */
export async function getDashboardAnalyticsAction() {
  await assertAdmin();
  return AdminService.getDashboardAnalytics();
}

/**
 * Admin action to toggle user block status
 */
export async function toggleUserBlockStateAction(userId: string, blocked: boolean) {
  await assertAdmin();
  return AdminService.toggleUserBlockState(userId, blocked);
}

/**
 * Admin action to update order status
 */
export async function updateOrderStatusAction(
  orderId: string, 
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Packed' | 'OutForDelivery' | 'Delivered' | 'Cancelled'
) {
  await assertAdmin();
  return AdminService.updateOrderStatus(orderId, status);
}

/**
 * Admin action to create a product
 */
export async function createProductAction(data: AdminProductInput) {
  await assertAdmin();
  const validated = adminProductSchema.parse(data);
  return AdminService.createProduct(validated);
}

/**
 * Admin action to update a product
 */
export async function updateProductAction(id: string, data: Partial<AdminProductInput>) {
  await assertAdmin();
  return AdminService.updateProduct(id, data);
}

/**
 * Admin action to delete a product
 */
export async function deleteProductAction(id: string) {
  await assertAdmin();
  return AdminService.deleteProduct(id);
}

/**
 * Admin action to create a category
 */
export async function createCategoryAction(data: AdminCategoryInput) {
  await assertAdmin();
  const validated = adminCategorySchema.parse(data);
  return AdminService.createCategory(validated);
}

/**
 * Admin action to update a category
 */
export async function updateCategoryAction(id: string, data: Partial<AdminCategoryInput>) {
  await assertAdmin();
  return AdminService.updateCategory(id, data);
}

/**
 * Admin action to delete a category
 */
export async function deleteCategoryAction(id: string) {
  await assertAdmin();
  return AdminService.deleteCategory(id);
}

/**
 * Admin action to create a coupon
 */
export async function createCouponAction(data: CouponInput) {
  await assertAdmin();
  const validated = couponSchema.parse(data);
  return AdminService.createCoupon(validated);
}

/**
 * Admin action to delete a coupon
 */
export async function deleteCouponAction(id: string) {
  await assertAdmin();
  return AdminService.deleteCoupon(id);
}

/**
 * Admin action to update enquiry status/notes
 */
export async function updateEnquiryAction(id: string, data: EnquiryUpdateInput) {
  await assertAdmin();
  const validated = enquiryUpdateSchema.parse(data);
  return AdminService.updateEnquiry(id, validated);
}

/**
 * Admin action to save homepage content overrides (sliders, payment_settings, etc.)
 */
export async function saveHomepageCMSAction(key: string, value: any) {
  await assertAdmin();
  return AdminService.saveHomepageCMS(key, value);
}

/**
 * Admin action to update SEO metadata keys
 */
export async function updateSeoMetadataAction(key: string, data: SeoInput) {
  await assertAdmin();
  const validated = seoSchema.parse(data);
  return AdminService.updateSeoMetadata(key, validated);
}

/**
 * Admin action to add an item to the showcase gallery
 */
export async function addGalleryImageAction(title: string, imageUrl: string, tags: string[], isFeatured = false) {
  await assertAdmin();
  return AdminService.addGalleryImage(title, imageUrl, tags, isFeatured);
}

/**
 * Admin action to delete a gallery item
 */
export async function deleteGalleryImageAction(id: string) {
  await assertAdmin();
  return AdminService.deleteGalleryImage(id);
}

/**
 * Admin action to regenerate sitemap XML structure
 */
export async function regenerateSitemapXMLAction() {
  await assertAdmin();
  return AdminService.generateSitemapXML();
}
