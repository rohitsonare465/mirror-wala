import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { CartService } from '@/services/cart.service';

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
      for (const item of items) {
        try {
          // Map customization to a string if it's an object
          const customizationStr = item.customization ? JSON.stringify(item.customization) : undefined;
          
          await cartService.addItemToCart(userCart.id, {
            productId: item.productId,
            quantity: item.quantity,
            customizationDetails: customizationStr,
          });
        } catch (itemErr) {
          console.warn(`⚠️ Failed to merge guest item ${item.productId}:`, itemErr);
        }
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
