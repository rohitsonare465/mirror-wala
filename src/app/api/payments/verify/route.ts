import { NextResponse } from 'next/server';
import { OrderService } from '@/services/order.service';
import { z } from 'zod';

const verifySchema = z.object({
  orderId: z.string().min(1, 'orderId is required'),
  razorpayPaymentId: z.string().min(1, 'razorpayPaymentId is required'),
  razorpaySignature: z.string().min(1, 'razorpaySignature is required'),
  razorpayOrderId: z.string().min(1, 'razorpayOrderId is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const { orderId, razorpayPaymentId, razorpaySignature, razorpayOrderId } = verifySchema.parse(body);

    const orderService = new OrderService();
    const verifiedOrder = await orderService.capturePayment(
      orderId,
      razorpayPaymentId,
      razorpaySignature,
      razorpayOrderId
    );

    return NextResponse.json({
      success: true,
      message: 'Payment verified and captured successfully',
      data: verifiedOrder,
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Payment verification failed',
    }, { status: 400 });
  }
}
