import prisma from '../prisma';
import { BaseRepository } from './base.repository';
import { ICartRepository } from '../../types/repository';

export class CartRepository extends BaseRepository<any> implements ICartRepository {
  constructor() {
    super('cart');
  }

  async findByUserId(userId: string): Promise<any | null> {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findByCartId(cartId: string): Promise<any | null> {
    return prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  override async create(userId?: string): Promise<any> {
    return prisma.cart.create({
      data: {
        userId: userId || null,
      },
    });
  }

  async addItem(cartId: string, itemData: {
    productId: string;
    quantity: number;
    customizationDetails?: string;
  }): Promise<any> {
    // Upsert the item inside the shopping cart
    const existing = await prisma.cartItem.findFirst({
      where: {
        cartId,
        productId: itemData.productId,
        customizationDetails: itemData.customizationDetails || null,
      },
    });

    if (existing) {
      return prisma.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity + itemData.quantity,
        },
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId,
        productId: itemData.productId,
        quantity: itemData.quantity,
        customizationDetails: itemData.customizationDetails || null,
      },
    });
  }

  async updateItemQuantity(itemId: string, quantity: number): Promise<any> {
    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  async removeItem(itemId: string): Promise<any> {
    return prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  async clearCart(cartId: string): Promise<any> {
    return prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
}
