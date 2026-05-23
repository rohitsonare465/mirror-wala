import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    // 1. Verify admin privilege using Better Auth session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse request FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string | null) || 'mirrorwala/products';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Validate that file is indeed an image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'File must be an image' }, { status: 400 });
    }

    // Limit maximum size to 10MB
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: 'Image size must be less than 10MB' }, { status: 400 });
    }

    // Convert file to binary buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sanitize file name for public ID
    const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || 'image';
    const sanitizedName = originalName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .substring(0, 50);
    const uniqueFileName = `${sanitizedName}_${Date.now()}`;

    // 3. Upload to Cloudinary stream
    const uploadResult = await uploadToCloudinary(buffer, folder, uniqueFileName);

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      publicId: uploadResult.publicId,
    });
  } catch (error: any) {
    console.error('API secure upload error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
