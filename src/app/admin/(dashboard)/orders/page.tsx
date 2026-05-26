import React from 'react';
import prisma from '@/lib/prisma';
import OrdersClient from './OrdersClient';

export const revalidate = 0; // Fresh database fetches

export default async function OrdersPage() {
  // Query all orders with items, payments, and users
  const orders = await prisma.order.findMany({
    include: {
      items: true,
      payment: true,
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        }
      },
      shippingAddress: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <OrdersClient initialOrders={orders} />
  );
}
