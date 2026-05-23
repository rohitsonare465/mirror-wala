import prisma from '../prisma';
import { BaseRepository } from './base.repository';
import { IProductRepository } from '../../types/repository';

export class ProductRepository extends BaseRepository<any> implements IProductRepository {
  constructor() {
    super('product');
  }

  async findBySlug(slug: string): Promise<any | null> {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: true,
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });
  }

  override async findMany(filters?: {
    categoryId?: string;
    isFeatured?: boolean;
    isNew?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<any[]> {
    const where: any = {};

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }
    if (filters?.isFeatured !== undefined) {
      where.featured = filters.isFeatured;
    }
    if (filters?.isNew !== undefined) {
      where.newArrival = filters.isNew;
    }
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return prisma.product.findMany({
      where,
      take: filters?.limit,
      skip: filters?.offset,
      include: {
        category: true,
        variants: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Categories operations
  async getCategories(): Promise<any[]> {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async createCategory(categoryData: any): Promise<any> {
    return prisma.category.create({
      data: categoryData,
    });
  }

  // Review operations
  async getProductReviews(productId: string): Promise<any[]> {
    return prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createReview(productId: string, userId: string, reviewData: any): Promise<any> {
    return prisma.review.create({
      data: {
        ...reviewData,
        productId,
        userId,
      },
    });
  }

  async approveReview(reviewId: string): Promise<any> {
    return prisma.review.update({
      where: { id: reviewId },
      data: { isApproved: true },
    });
  }
}
