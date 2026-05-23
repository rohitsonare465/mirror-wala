import { ProductRepository } from '../lib/repositories/product.repository';
import { 
  createProductSchema, 
  createCategorySchema, 
  createReviewSchema,
  CreateProductInput,
  CreateCategoryInput,
  CreateReviewInput 
} from '../validations/product';

export class ProductService {
  private productRepository: ProductRepository;

  constructor(productRepository = new ProductRepository()) {
    this.productRepository = productRepository;
  }

  /**
   * Retrieves a product by its unique database ID.
   */
  async getProductById(id: string) {
    if (!id) throw new Error('Product ID is required');
    return this.productRepository.findById(id);
  }

  /**
   * Retrieves a product by its unique web slug, including category, variants, and approved reviews.
   */
  async getProductBySlug(slug: string) {
    if (!slug) throw new Error('Product slug is required');
    return this.productRepository.findBySlug(slug);
  }

  /**
   * Searches and filters products in the catalog.
   */
  async getProducts(filters?: {
    categoryId?: string;
    isFeatured?: boolean;
    isNew?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    return this.productRepository.findMany(filters);
  }

  /**
   * Creates a new premium product in the catalog with Zod validation.
   */
  async createProduct(data: CreateProductInput) {
    const validatedData = createProductSchema.parse(data);
    
    // Structure the input data for Prisma (separate variants nesting if needed, or handle variations)
    const { variants, ...productFields } = validatedData;
    
    const productData = {
      ...productFields,
      variants: variants ? {
        create: variants
      } : undefined
    };

    return this.productRepository.create(productData);
  }

  /**
   * Updates an existing catalog product.
   */
  async updateProduct(id: string, data: Partial<CreateProductInput>) {
    if (!id) throw new Error('Product ID is required to update');
    
    // Partial validation: parse only present fields
    const validatedData = createProductSchema.partial().parse(data);
    const { variants, ...productFields } = validatedData;

    // Handle updates to variants separately or inside transaction if needed
    // Simple update structure:
    const updateData: any = { ...productFields };
    if (variants) {
      updateData.variants = {
        deleteMany: {}, // Wipe old variants and insert new ones for simplicity
        create: variants
      };
    }

    return this.productRepository.update(id, updateData);
  }

  /**
   * Deletes a product from the catalog.
   */
  async deleteProduct(id: string) {
    if (!id) throw new Error('Product ID is required to delete');
    return this.productRepository.delete(id);
  }

  /**
   * Retrieves all product categories sorted alphabetically.
   */
  async getCategories() {
    return this.productRepository.getCategories();
  }

  /**
   * Creates a new product category after validation.
   */
  async createCategory(data: CreateCategoryInput) {
    const validatedData = createCategorySchema.parse(data);
    return this.productRepository.createCategory(validatedData);
  }

  /**
   * Retrieves all reviews submitted for a specific product.
   */
  async getProductReviews(productId: string) {
    if (!productId) throw new Error('Product ID is required to fetch reviews');
    return this.productRepository.getProductReviews(productId);
  }

  /**
   * Submits a customer review for a product. Automatically defaults to unapproved state.
   */
  async submitReview(data: CreateReviewInput) {
    const validatedData = createReviewSchema.parse(data);
    const { productId, userId, ...reviewFields } = validatedData;
    
    return this.productRepository.createReview(productId, userId, {
      ...reviewFields,
      isApproved: false, // Explicitly false, requires admin action
    });
  }

  /**
   * Admin-only operation to approve and publish a review.
   */
  async approveReview(reviewId: string) {
    if (!reviewId) throw new Error('Review ID is required to approve');
    return this.productRepository.approveReview(reviewId);
  }
}
