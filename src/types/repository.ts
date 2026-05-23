export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findMany(filter?: Record<string, any>): Promise<T[]>;
  create(data: Record<string, any>): Promise<T>;
  update(id: string, data: Record<string, any>): Promise<T>;
  delete(id: string): Promise<T>;
}

export interface IUserRepository {
  findById(id: string): Promise<any | null>;
  findByEmail(email: string): Promise<any | null>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<any>;
  
  // Custom queries for addresses and admins
  getUserAddresses(userId: string): Promise<any[]>;
  createUserAddress(userId: string, addressData: any): Promise<any>;
  setUserDefaultAddress(userId: string, addressId: string): Promise<any>;
  
  // Custom Wishlist queries
  getWishlist(userId: string): Promise<any[]>;
  addToWishlist(userId: string, productId: string): Promise<any>;
  removeFromWishlist(userId: string, productId: string): Promise<any>;
  
  // Custom Admin queries
  getAdminProfile(userId: string): Promise<any | null>;
}

export interface IProductRepository {
  findById(id: string): Promise<any | null>;
  findBySlug(slug: string): Promise<any | null>;
  findMany(filters?: {
    categoryId?: string;
    isFeatured?: boolean;
    isNew?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<any[]>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<any>;
  
  // Categories management
  getCategories(): Promise<any[]>;
  createCategory(categoryData: any): Promise<any>;
  
  // Reviews management
  getProductReviews(productId: string): Promise<any[]>;
  createReview(productId: string, userId: string, reviewData: any): Promise<any>;
  approveReview(reviewId: string): Promise<any>;
}

export interface ICartRepository {
  findByUserId(userId: string): Promise<any | null>;
  findByCartId(cartId: string): Promise<any | null>;
  create(userId?: string): Promise<any>;
  addItem(cartId: string, itemData: {
    productId: string;
    quantity: number;
    customizationDetails?: string;
  }): Promise<any>;
  updateItemQuantity(itemId: string, quantity: number): Promise<any>;
  removeItem(itemId: string): Promise<any>;
  clearCart(cartId: string): Promise<any>;
}

export interface IOrderRepository {
  findById(id: string): Promise<any | null>;
  findByOrderNumber(orderNumber: string): Promise<any | null>;
  findUserOrders(userId: string): Promise<any[]>;
  findMany(filters?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<any[]>;
  create(userId: string | null, orderData: {
    orderNumber: string;
    shippingAddressId?: string;
    totalAmount: number;
    paymentMethod: 'RAZORPAY' | 'COD';
    couponCode?: string;
    items: Array<{
      productId: string;
      productName: string;
      quantity: number;
      price: number;
      customizationDetails?: string;
    }>;
  }): Promise<any>;
  updateStatus(id: string, status: any): Promise<any>;
  updatePaymentStatus(id: string, paymentStatus: any, gatewayId?: string): Promise<any>;
  
  // Coupon Verification
  getCouponByCode(code: string): Promise<any | null>;
  createCoupon(couponData: any): Promise<any>;
}

export interface IEnquiryRepository {
  findById(id: string): Promise<any | null>;
  findMany(filters?: {
    status?: string;
    type?: string;
  }): Promise<any[]>;
  create(enquiryData: any): Promise<any>;
  updateStatus(id: string, status: any, adminNotes?: string): Promise<any>;
}
