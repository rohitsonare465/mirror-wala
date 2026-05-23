import { OrderRepository } from '../lib/repositories/order.repository';
import { UserRepository } from '../lib/repositories/user.repository';
import { ProductRepository } from '../lib/repositories/product.repository';
import { EmailService } from './email';
import { PaymentService } from './payment.service';
import { 
  checkoutValidationSchema, 
  createCouponSchema, 
  CheckoutInput, 
  CreateCouponInput 
} from '../validations/order';
import { Order as CoreOrder, OrderStatus as CoreOrderStatus, PaymentStatus as CorePaymentStatus } from '../types/order';

export class OrderService {
  private orderRepository: OrderRepository;
  private userRepository: UserRepository;
  private productRepository: ProductRepository;

  constructor(
    orderRepository = new OrderRepository(),
    userRepository = new UserRepository(),
    productRepository = new ProductRepository()
  ) {
    this.orderRepository = orderRepository;
    this.userRepository = userRepository;
    this.productRepository = productRepository;
  }

  /**
   * Validates and applies coupon, checking dates, active status, and minimum value.
   */
  async verifyCoupon(code: string, orderValue: number) {
    if (!code) throw new Error('Coupon code is required');
    
    const coupon = await this.orderRepository.getCouponByCode(code);
    if (!coupon) {
      return { isValid: false, reason: 'Coupon code not found' };
    }

    if (!coupon.isActive) {
      return { isValid: false, reason: 'Coupon code is no longer active' };
    }

    const now = new Date();
    if (now < new Date(coupon.startDate) || now > new Date(coupon.endDate)) {
      return { isValid: false, reason: 'Coupon code has expired or is not yet active' };
    }

    if (coupon.minOrderValue && orderValue < coupon.minOrderValue) {
      return { isValid: false, reason: `Minimum order value of ₹${coupon.minOrderValue} required` };
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = orderValue * (coupon.discountValue / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.discountType === 'FIXED') {
      discountAmount = coupon.discountValue;
    }

    discountAmount = Math.min(discountAmount, orderValue); // Cannot discount more than order value

    return {
      isValid: true,
      coupon,
      discountAmount,
    };
  }

  /**
   * Creates a new coupon with Zod validations.
   */
  async createCoupon(data: CreateCouponInput) {
    const validatedData = createCouponSchema.parse(data);
    return this.orderRepository.createCoupon({
      ...validatedData,
      startDate: new Date(validatedData.startDate),
      endDate: new Date(validatedData.endDate),
    });
  }

  /**
   * Checkout orchestrator handling validation, guest user creation, address setup, price resolution, coupon application, and database transactions.
   */
  async checkout(userId: string | null, checkoutData: CheckoutInput) {
    // 1. Zod parse inputs
    const validatedData = checkoutValidationSchema.parse(checkoutData);

    // 2. Resolve User Account
    let activeUserId = userId;
    let customerEmail = '';

    if (!activeUserId) {
      // Guest Checkout. Retrieve or create temporary guest user from email
      const shippingAddress = validatedData.shippingAddress;
      if (!shippingAddress) {
        throw new Error('Shipping address is required for guest checkout');
      }
      const email = shippingAddress.email;
      customerEmail = email;

      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        activeUserId = existingUser.id;
      } else {
        // Create a basic guest account
        const newUser = await this.userRepository.create({
          name: shippingAddress.fullName,
          email,
          emailVerified: false,
          phone: shippingAddress.phone,
        });
        activeUserId = newUser.id;
      }
    } else {
      // Authenticated User
      const user = await this.userRepository.findById(activeUserId);
      if (!user) throw new Error('Authenticated user account not found');
      customerEmail = user.email;
    }

    // 3. Resolve Shipping Address ID
    let finalAddressId = validatedData.shippingAddressId;
    if (!finalAddressId) {
      const shippingAddress = validatedData.shippingAddress;
      if (!shippingAddress) {
        throw new Error('Shipping address or address ID is required');
      }
      // Create shipping address for user
      const address = await this.userRepository.createUserAddress(activeUserId!, {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        addressLine: shippingAddress.addressLine,
        city: shippingAddress.city,
        state: shippingAddress.state,
        country: shippingAddress.country || 'India',
        pincode: shippingAddress.pincode,
        isDefault: false,
      });
      finalAddressId = address.id;
    }

    // 4. Resolve catalog items and prices
    const itemDetails = [];
    let itemsSubtotal = 0;

    for (const cartItem of validatedData.items) {
      const product = await this.productRepository.findById(cartItem.productId);
      if (!product) {
        throw new Error(`Product not found in catalog: ${cartItem.productId}`);
      }

      if (product.stock < cartItem.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.stock}`);
      }

      const unitPrice = product.salePrice ?? product.price;
      const itemTotal = unitPrice * cartItem.quantity;
      itemsSubtotal += itemTotal;

      itemDetails.push({
        productId: product.id,
        productName: product.name,
        quantity: cartItem.quantity,
        price: unitPrice,
        customizationDetails: cartItem.customizationDetails || undefined,
      });
    }

    // 5. Apply Coupon Discount if applicable
    let finalAmount = itemsSubtotal;
    let couponDiscount = 0;
    if (validatedData.couponCode) {
      const couponCheck = await this.verifyCoupon(validatedData.couponCode, itemsSubtotal);
      if (couponCheck.isValid && couponCheck.discountAmount) {
        couponDiscount = couponCheck.discountAmount;
        finalAmount -= couponDiscount;
      }
    }

    // 6. Generate order number
    const orderNumber = `MW-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 7. Trigger atomicity transaction in order repository
    const prismaOrder = await this.orderRepository.create(activeUserId, {
      orderNumber,
      shippingAddressId: finalAddressId ?? undefined,
      totalAmount: finalAmount,
      paymentMethod: validatedData.paymentMethod,
      couponCode: validatedData.couponCode || undefined,
      items: itemDetails,
    });

    // 8. Handle Payment Options (COD vs Razorpay gateway setup)
    if (validatedData.paymentMethod === 'RAZORPAY') {
      const razorpayOrder = await PaymentService.createOrder({
        amount: Math.round(finalAmount * 100), // INR in paise
        currency: 'INR',
        receipt: prismaOrder.orderNumber,
      });

      return {
        paymentMethod: 'RAZORPAY',
        order: await this.getOrderDetails(prismaOrder.id),
        gatewayDetails: {
          razorpayOrderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
        },
      };
    }

    // Cash on Delivery - Verify dynamic COD eligibility
    const codCheck = await PaymentService.checkCodEligibility(finalAmount);
    if (!codCheck.eligible) {
      await this.orderRepository.updateStatus(prismaOrder.id, 'Cancelled');
      throw new Error(codCheck.reason || 'Cash on Delivery is not available for this order.');
    }

    const fullOrder = await this.getOrderDetails(prismaOrder.id);
    await EmailService.sendOrderConfirmation(fullOrder);

    return {
      paymentMethod: 'COD',
      order: fullOrder,
    };
  }

  /**
   * Captures and validates payment webhook signatures.
   */
  async capturePayment(
    orderId: string,
    gatewayPaymentId: string,
    signature: string,
    gatewayOrderId: string
  ) {
    const isVerified = PaymentService.verifyPaymentSignature({
      razorpayOrderId: gatewayOrderId,
      razorpayPaymentId: gatewayPaymentId,
      razorpaySignature: signature,
    });

    if (!isVerified) {
      throw new Error('Payment signature verification failed');
    }

    // Update state atomically
    const updatedPrismaOrder = await this.orderRepository.updatePaymentStatus(orderId, 'PAID', gatewayPaymentId);
    await this.orderRepository.updateStatus(orderId, 'Confirmed');

    // Dispatch luxury transaction email
    const fullOrder = await this.getOrderDetails(orderId);
    await EmailService.sendOrderConfirmation(fullOrder);

    return fullOrder;
  }

  /**
   * Admin status driver.
   */
  async updateOrderStatus(orderId: string, status: 'Pending' | 'Confirmed' | 'Processing' | 'Packed' | 'OutForDelivery' | 'Delivered' | 'Cancelled') {
    if (!orderId) throw new Error('Order ID is required');
    return this.orderRepository.updateStatus(orderId, status);
  }

  /**
   * Retrieves mapped, detailed order snapshots.
   */
  async getOrderDetails(orderId: string): Promise<CoreOrder> {
    const prismaOrder = await this.orderRepository.findById(orderId);
    if (!prismaOrder) throw new Error('Order not found');
    
    // Make sure relations are populated
    const details = await this.orderRepository.findByOrderNumber(prismaOrder.orderNumber);
    return this.mapPrismaOrderToCore(details);
  }

  /**
   * Retrieves mapped order list for user.
   */
  async getUserOrders(userId: string): Promise<CoreOrder[]> {
    const prismaOrders = await this.orderRepository.findUserOrders(userId);
    return Promise.all(prismaOrders.map(o => this.getOrderDetails(o.id)));
  }

  /**
   * Helper mapping Prisma MongoDB structures to luxury domain Core Types.
   */
  private mapPrismaOrderToCore(prismaOrder: any): CoreOrder {
    const statusMap: Record<string, CoreOrderStatus> = {
      Pending: 'PENDING',
      Confirmed: 'CONFIRMED',
      Processing: 'MANUFACTURING',
      Packed: 'SHIPPED',
      OutForDelivery: 'SHIPPED',
      Delivered: 'DELIVERED',
      Cancelled: 'CANCELLED',
    };

    const paymentStatusMap: Record<string, CorePaymentStatus> = {
      PENDING: 'PENDING',
      AUTHORIZED: 'AUTHORIZED',
      PAID: 'PAID',
      FAILED: 'FAILED',
      REFUNDED: 'REFUNDED',
    };

    const items = (prismaOrder.items || []).map((item: any) => ({
      id: item.id,
      orderId: item.orderId,
      productId: item.productId,
      productName: item.productName,
      productSku: item.product?.sku ?? 'N/A',
      variantDetails: null,
      customizationDetails: item.customizationDetails || null,
      quantity: item.quantity,
      price: item.price,
      totalPrice: item.totalPrice,
    }));

    // Calculate subtotal and discount
    const subtotal = items.reduce((sum: number, i: any) => sum + i.totalPrice, 0);
    const discountAmount = Math.max(0, subtotal - prismaOrder.totalAmount);

    return {
      id: prismaOrder.id,
      orderNumber: prismaOrder.orderNumber,
      userId: prismaOrder.userId,
      guestEmail: prismaOrder.userId ? null : prismaOrder.shippingAddress?.user?.email ?? null,
      status: statusMap[prismaOrder.orderStatus] || 'PENDING',
      paymentStatus: paymentStatusMap[prismaOrder.paymentStatus] || 'PENDING',
      paymentMethod: prismaOrder.paymentMethod,
      paymentGatewayId: prismaOrder.payment?.paymentGatewayId ?? null,
      shippingAddress: {
        fullName: prismaOrder.shippingAddress?.fullName ?? '',
        phone: prismaOrder.shippingAddress?.phone ?? '',
        email: prismaOrder.shippingAddress?.user?.email ?? prismaOrder.user?.email ?? '',
        addressLine1: prismaOrder.shippingAddress?.addressLine ?? '',
        city: prismaOrder.shippingAddress?.city ?? '',
        state: prismaOrder.shippingAddress?.state ?? '',
        postalCode: prismaOrder.shippingAddress?.pincode ?? '',
        country: prismaOrder.shippingAddress?.country ?? 'India',
      },
      items,
      subtotal,
      discountAmount,
      couponCode: prismaOrder.coupon?.code ?? null,
      shippingCharges: 0,
      taxAmount: 0,
      totalAmount: prismaOrder.totalAmount,
      notes: null,
      createdAt: prismaOrder.createdAt,
      updatedAt: prismaOrder.updatedAt,
    };
  }
}
