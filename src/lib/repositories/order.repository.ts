import prisma from '../prisma';
import { BaseRepository } from './base.repository';
import { IOrderRepository } from '../../types/repository';

export class OrderRepository extends BaseRepository<any> implements IOrderRepository {
  constructor() {
    super('order');
  }

  async findByOrderNumber(orderNumber: string): Promise<any | null> {
    return prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
        coupon: true,
      },
    });
  }

  async findUserOrders(userId: string): Promise<any[]> {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  override async findMany(filters?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<any[]> {
    const where: any = {};
    if (filters?.status) {
      where.orderStatus = filters.status;
    }

    return prisma.order.findMany({
      where,
      take: filters?.limit,
      skip: filters?.offset,
      include: {
        payment: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  override async create(userId: string | null, orderData: {
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
  }): Promise<any> {
    // 1. Resolve coupon if present
    let couponId: string | undefined;
    if (orderData.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: orderData.couponCode },
      });
      if (coupon) {
        couponId = coupon.id;
      }
    }

    // 2. Perform checkout transactions atomically using Prisma MongoDB transaction support
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: userId || null,
          orderNumber: orderData.orderNumber,
          totalAmount: orderData.totalAmount,
          paymentMethod: orderData.paymentMethod,
          shippingAddressId: orderData.shippingAddressId || null,
          couponId: couponId || null,
          orderStatus: 'Pending',
        },
      });

      // Create all related order item documents
      for (const item of orderData.items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.price * item.quantity,
            customizationDetails: item.customizationDetails || null,
          },
        });

        // Decrement product inventory safely
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Initialize Payment record document
      await tx.payment.create({
        data: {
          orderId: order.id,
          amount: orderData.totalAmount,
          status: 'PENDING',
          method: orderData.paymentMethod,
        },
      });

      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          items: true,
          payment: true,
        },
      });
    });
  }

  async updateStatus(id: string, status: any): Promise<any> {
    return prisma.order.update({
      where: { id },
      data: { orderStatus: status },
    });
  }

  async updatePaymentStatus(id: string, paymentStatus: any, gatewayId?: string): Promise<any> {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id },
        data: { paymentStatus },
      });

      await tx.payment.update({
        where: { orderId: id },
        data: {
          status: paymentStatus,
          paymentGatewayId: gatewayId || null,
        },
      });

      return order;
    });
  }

  // Coupon Verification Queries
  async getCouponByCode(code: string): Promise<any | null> {
    return prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });
  }

  async createCoupon(couponData: any): Promise<any> {
    return prisma.coupon.create({
      data: couponData,
    });
  }
}
