import { Product, MirrorVariant } from './product';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'MANUFACTURING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'PAID' | 'FAILED' | 'REFUNDED';

export type PaymentMethod = 'RAZORPAY' | 'COD';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface SelectedCustomization {
  shape?: string;
  ledColor?: string;
  edgeStyle?: string;
  features?: string[];
}

export interface CartItem {
  id: string; // unique cart item id (e.g. hash of config)
  productId: string;
  product: Product;
  variantId: string | null;
  variant: MirrorVariant | null;
  customization: SelectedCustomization | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productSku: string;
  variantDetails: string | null; // JSON snapshot of variant dimensions
  customizationDetails: string | null; // JSON snapshot of customizations
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue: number | null;
  maxDiscount: number | null;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  guestEmail: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentGatewayId: string | null; // Razorpay payment/order id
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode: string | null;
  shippingCharges: number;
  taxAmount: number;
  totalAmount: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
