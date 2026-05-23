import React from 'react';
import { AdminService } from '@/services/admin.service';
import CouponsClient from './CouponsClient';

export const revalidate = 0; // Fresh database fetches

export default async function CouponsPage() {
  const coupons = await AdminService.listCoupons();

  // Convert Date objects to JSON-compatible strings if needed or just pass them as Prisma output (Next.js client components can accept serializable objects).
  // Note: Prisma Date objects might need to be serialized. Let's serialize dates explicitly to avoid any serialization warning/error across Next.js Server-to-Client boundaries.
  const serializedCoupons = coupons.map(c => ({
    ...c,
    discountType: c.discountType as 'PERCENTAGE' | 'FIXED',
    startDate: c.startDate.toISOString(),
    endDate: c.endDate.toISOString(),
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  return (
    <CouponsClient initialCoupons={serializedCoupons} />
  );
}
