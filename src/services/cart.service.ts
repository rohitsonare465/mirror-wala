import { CartRepository } from '../lib/repositories/cart.repository';
import { cartItemSchema } from '../validations/order';

export class CartService {
  private cartRepository: CartRepository;

  constructor(cartRepository = new CartRepository()) {
    this.cartRepository = cartRepository;
  }

  /**
   * Retrieves or initializes a cart. Nullable userId indicates a guest session.
   */
  async getOrCreateCart(userId?: string, guestCartId?: string) {
    if (userId) {
      let cart = await this.cartRepository.findByUserId(userId);
      if (!cart) {
        cart = await this.cartRepository.create(userId);
      }
      return cart;
    }

    if (guestCartId) {
      const cart = await this.cartRepository.findByCartId(guestCartId);
      if (cart) {
        return cart;
      }
    }

    // Create a new guest cart
    return this.cartRepository.create();
  }

  /**
   * Adds a item to a specific cart with input validation.
   */
  async addItemToCart(cartId: string, itemData: {
    productId: string;
    quantity: number;
    customizationDetails?: string;
  }) {
    if (!cartId) throw new Error('Cart ID is required');
    
    // Validate request inputs using Checkout pipeline validation subsets
    const validated = cartItemSchema.parse(itemData);

    return this.cartRepository.addItem(cartId, {
      productId: validated.productId,
      quantity: validated.quantity,
      customizationDetails: validated.customizationDetails || undefined,
    });
  }

  /**
   * Updates the quantity of a cart item. Automatically deletes the item if quantity drops to 0.
   */
  async updateItemQuantity(itemId: string, quantity: number) {
    if (!itemId) throw new Error('Item ID is required');
    if (quantity <= 0) {
      return this.cartRepository.removeItem(itemId);
    }
    return this.cartRepository.updateItemQuantity(itemId, quantity);
  }

  /**
   * Removes a specific item from a cart.
   */
  async removeItemFromCart(itemId: string) {
    if (!itemId) throw new Error('Item ID is required');
    return this.cartRepository.removeItem(itemId);
  }

  /**
   * Wipes all items in a cart.
   */
  async clearCart(cartId: string) {
    if (!cartId) throw new Error('Cart ID is required');
    return this.cartRepository.clearCart(cartId);
  }

  /**
   * Merges guest items into a user's authenticated cart upon login.
   */
  async mergeCarts(guestCartId: string, userId: string) {
    if (!guestCartId || !userId) {
      throw new Error('Both guestCartId and userId are required to merge carts');
    }

    const guestCart = await this.cartRepository.findByCartId(guestCartId);
    if (!guestCart || !guestCart.items || guestCart.items.length === 0) {
      return this.getOrCreateCart(userId);
    }

    const userCart = await this.getOrCreateCart(userId);

    // Merge each item from guest cart to user cart
    for (const item of guestCart.items) {
      await this.cartRepository.addItem(userCart.id, {
        productId: item.productId,
        quantity: item.quantity,
        customizationDetails: item.customizationDetails || undefined,
      });
    }

    // Clean up the guest cart
    await this.cartRepository.clearCart(guestCartId);

    return this.cartRepository.findByCartId(userCart.id);
  }
}
