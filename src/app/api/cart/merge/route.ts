import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { CartService } from '@/services/cart.service';
import prisma from '@/lib/prisma';

const cartService = new CartService();

// POST /api/cart/merge - Merge guest cart items into authenticated user's cart
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { items } = body; // Array of { productId, quantity, customization }

    const userCart = await cartService.getOrCreateCart(session.user.id);

    if (items && Array.isArray(items) && items.length > 0) {
      // 1. Fetch valid product IDs in a single query
      const productIds = items.map((item: any) => item.productId).filter(Boolean);
      const dbProducts = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true },
      });
      const validProductIds = new Set(dbProducts.map(p => p.id));

      // 2. Fetch existing cart items in a single query
      const existingCartItems = await prisma.cartItem.findMany({
        where: { cartId: userCart.id },
      });

      // 3. Separate operations into updates and creations
      const operations: any[] = [];

      for (const item of items) {
        if (!validProductIds.has(item.productId)) {
          console.warn(`⚠️ Skipping invalid product ID: ${item.productId}`);
          continue;
        }

        const customizationStr = item.customization ? JSON.stringify(item.customization) : null;
        
        // Find if this item already exists in the user's database cart
        const existing = existingCartItems.find(
          (dbItem) =>
            dbItem.productId === item.productId &&
            dbItem.customizationDetails === customizationStr
        );

        if (existing) {
          // Prepare an update query
          operations.push(
            prisma.cartItem.update({
              where: { id: existing.id },
              data: {
                quantity: existing.quantity + item.quantity,
              },
            })
          );
        } else {
          // Prepare a create query
          operations.push(
            prisma.cartItem.create({
              data: {
                cartId: userCart.id,
                productId: item.productId,
                quantity: item.quantity,
                customizationDetails: customizationStr,
              },
            })
          );
        }
      }

      // 4. Execute all operations in a single fast transaction
      if (operations.length > 0) {
        await prisma.$transaction(operations);
      }
    }

    // Retrieve the fully merged cart
    const mergedCart = await cartService.getOrCreateCart(session.user.id);

    return NextResponse.json({ success: true, data: mergedCart });
  } catch (error: any) {
    console.error('Error merging carts:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
