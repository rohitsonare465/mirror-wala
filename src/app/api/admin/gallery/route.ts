import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { AdminService } from '@/services/admin.service';
import { z } from 'zod';

const addImageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  imageUrl: z.string().url('Must be a valid URL'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  isFeatured: z.boolean().default(false),
});

export async function GET() {
  try {
    const gallery = await AdminService.listGallery();
    return NextResponse.json({ success: true, data: gallery });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = addImageSchema.parse(body);

    const result = await AdminService.addGalleryImage(
      validatedData.title,
      validatedData.imageUrl,
      validatedData.tags,
      validatedData.isFeatured
    );

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
