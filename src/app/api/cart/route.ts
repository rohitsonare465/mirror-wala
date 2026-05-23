import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { CartService } from '@/services/cart.service';

const cartService = new CartService();

// GET /api/cart - Get user's cart
export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const cart = await cartService.getOrCreateCart(session.user.id);
    return NextResponse.json({ success: true, data: cart });
  } catch (error: any) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/cart - Add item to user's cart
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { productId, quantity, customizationDetails } = body;

    if (!productId || !quantity) {
      return NextResponse.json({ success: false, error: 'Product ID and quantity are required' }, { status: 400 });
    }

    const cart = await cartService.getOrCreateCart(session.user.id);
    const item = await cartService.addItemToCart(cart.id, {
      productId,
      quantity,
      customizationDetails: customizationDetails ? JSON.stringify(customizationDetails) : undefined,
    });

    // Fetch the updated cart to return to client
    const updatedCart = await cartService.getOrCreateCart(session.user.id);

    return NextResponse.json({ success: true, data: updatedCart });
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/cart - Update item quantity
export async function PUT(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { itemId, quantity } = body;

    if (!itemId || quantity === undefined) {
      return NextResponse.json({ success: false, error: 'Item ID and quantity are required' }, { status: 400 });
    }

    await cartService.updateItemQuantity(itemId, quantity);
    const updatedCart = await cartService.getOrCreateCart(session.user.id);

    return NextResponse.json({ success: true, data: updatedCart });
  } catch (error: any) {
    console.error('Error updating cart item:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/cart - Remove item or clear cart
export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemId');
    const clear = searchParams.get('clear');

    const cart = await cartService.getOrCreateCart(session.user.id);

    if (clear === 'true') {
      await cartService.clearCart(cart.id);
    } else if (itemId) {
      await cartService.removeItemFromCart(itemId);
    } else {
      return NextResponse.json({ success: false, error: 'Item ID or clear=true parameter is required' }, { status: 400 });
    }

    const updatedCart = await cartService.getOrCreateCart(session.user.id);
    return NextResponse.json({ success: true, data: updatedCart });
  } catch (error: any) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
