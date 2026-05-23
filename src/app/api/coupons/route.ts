import { NextResponse } from 'next/server';

/**
 * Mirrorwala API Endpoint: /api/coupons
 * Pure Service and Transaction Skeleton
 */
export async function GET(request: Request) {
  try {
    return NextResponse.json({
      success: true,
      message: 'API stub for coupons fetch',
      data: []
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
      message: 'API stub for coupons creation',
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
