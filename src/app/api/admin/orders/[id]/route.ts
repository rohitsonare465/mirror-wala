import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { AdminService } from '@/services/admin.service';

export async function PUT(
  request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    if (!body.status) {
      return NextResponse.json({ success: false, error: 'Status field is required' }, { status: 400 });
    }

    const updatedOrder = await AdminService.updateOrderStatus(id, body.status);
    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
