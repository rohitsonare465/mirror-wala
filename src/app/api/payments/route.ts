import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { OrderService } from '@/services/order.service';
import { checkoutValidationSchema } from '@/validations/order';
import { RateLimiter } from '@/lib/security';

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting protection
    const rateLimit = RateLimiter.limit(request);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Too many checkout requests. Please wait a few seconds and try again.' },
        { 
          status: 429, 
          headers: RateLimiter.getHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset) 
        }
      );
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const body = await request.json();
    
    // Parse using Zod
    const parsedData = checkoutValidationSchema.parse(body);

    const userId = session?.user?.id || null;
    const orderService = new OrderService();

    const result = await orderService.checkout(userId, parsedData);

    return NextResponse.json({
      success: true,
      message: parsedData.paymentMethod === 'RAZORPAY' 
        ? 'Razorpay order generated successfully' 
        : 'Cash on delivery order placed successfully',
      data: result,
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Payment initiation failed',
    }, { status: 400 });
  }
}
