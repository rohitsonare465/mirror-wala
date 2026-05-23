import prisma from '../prisma';
import { BaseRepository } from './base.repository';
import { IUserRepository } from '../../types/repository';

export class UserRepository extends BaseRepository<any> implements IUserRepository {
  constructor() {
    super('user');
  }

  async findByEmail(email: string): Promise<any | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  // Address operations
  async getUserAddresses(userId: string): Promise<any[]> {
    return prisma.address.findMany({
      where: { userId },
    });
  }

  async createUserAddress(userId: string, addressData: any): Promise<any> {
    // If setting default, unset other defaults first
    if (addressData.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return prisma.address.create({
      data: {
        ...addressData,
        userId,
      },
    });
  }

  async setUserDefaultAddress(userId: string, addressId: string): Promise<any> {
    // 1. Unset all addresses default
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    // 2. Set default to selected target
    return prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }

  // Wishlist operations
  async getWishlist(userId: string): Promise<any[]> {
    return prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });
  }

  async addToWishlist(userId: string, productId: string): Promise<any> {
    return prisma.wishlist.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      create: {
        userId,
        productId,
      },
      update: {},
    });
  }

  async removeFromWishlist(userId: string, productId: string): Promise<any> {
    return prisma.wishlist.deleteMany({
      where: {
        userId,
        productId,
      },
    });
  }

  // Admin Profile
  async getAdminProfile(userId: string): Promise<any | null> {
    return prisma.admin.findUnique({
      where: { userId },
    });
  }
}
