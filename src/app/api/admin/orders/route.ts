import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { AdminService } from '@/services/admin.service';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('export');

    if (format === 'csv') {
      const csvData = await AdminService.getOrdersCSV();
      
      return new Response(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="mirrorwala-orders.csv"',
        },
      });
    }

    const status = searchParams.get('status');
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;
    
    const where: any = {};
    if (status) {
      where.orderStatus = status;
    }

    const orders = await prisma.order.findMany({
      where,
      take: limit,
      include: {
        items: {
          include: {
            product: true
          }
        },
        payment: true,
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
