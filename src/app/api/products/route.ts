import { NextResponse } from 'next/server';
import { ProductService } from '@/services/product.service';

const productService = new ProductService();

/**
 * Mirrorwala API Endpoint: /api/products
 * Fetches products from database with optional search and category filters.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const categoryId = searchParams.get('categoryId') || undefined;

    const products = await productService.getProducts({
      search,
      categoryId,
    });

    return NextResponse.json({
      success: true,
      data: products
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'API stub for products creation',
      data: body
    }, { status: 201 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
