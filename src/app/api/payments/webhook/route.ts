import { NextResponse } from 'next/server';
import { PaymentService } from '@/services/payment.service';
import { OrderRepository } from '@/lib/repositories/order.repository';
import prisma from '@/lib/prisma';
import { EmailService } from '@/services/email';
import { OrderService } from '@/services/order.service';

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-razorpay-signature') || '';
    const bodyText = await request.text();

    const isValid = PaymentService.verifyWebhookSignature(bodyText, signature);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid webhook signature' }, { status: 400 });
    }

    const event = JSON.parse(bodyText);
    const orderRepository = new OrderRepository();
    const orderService = new OrderService();

    const paymentEntity = event.payload?.payment?.entity;
    if (!paymentEntity) {
      return NextResponse.json({ success: true, message: 'Webhook received but payload has no payment entity' });
    }

    // receipt references our local orderNumber
    const orderNumber = paymentEntity.receipt;
    if (!orderNumber) {
      return NextResponse.json({ success: true, message: 'Webhook received but payment has no receipt' });
    }

    const order = await orderRepository.findByOrderNumber(orderNumber);
    if (!order) {
      return NextResponse.json({ success: false, error: `Order not found for order number: ${orderNumber}` }, { status: 404 });
    }

    const gatewayPaymentId = paymentEntity.id;

    switch (event.event) {
      case 'payment.captured':
        if (order.paymentStatus !== 'PAID') {
          await orderRepository.updatePaymentStatus(order.id, 'PAID', gatewayPaymentId);
          await orderRepository.updateStatus(order.id, 'Confirmed');

          // Send confirmation email
          try {
            const fullOrder = await orderService.getOrderDetails(order.id);
            await EmailService.sendOrderConfirmation(fullOrder);
          } catch (emailErr) {
            console.error('Failed to send order confirmation email inside webhook:', emailErr);
          }
        }
        break;

      case 'payment.failed':
        await orderRepository.updatePaymentStatus(order.id, 'FAILED', gatewayPaymentId);
        break;

      case 'refund.processed':
        await orderRepository.updatePaymentStatus(order.id, 'REFUNDED', gatewayPaymentId);
        
        // Restore inventory stock atomically
        if (order.items) {
          for (const item of order.items) {
            await prisma.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  increment: item.quantity,
                },
              },
            });
          }
        }
        break;

      default:
        break;
    }

    return NextResponse.json({ success: true, event: event.event }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Webhook processing failed',
    }, { status: 500 });
  }
}
