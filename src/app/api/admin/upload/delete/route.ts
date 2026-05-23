import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { deleteFromCloudinary, extractPublicIdFromUrl } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    // 1. Verify admin privilege using Better Auth session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse request body JSON
    const body = await request.json();
    const { url, publicId } = body;

    let idToDelete = publicId;

    // Fallback to parsing public ID from the URL if not provided directly
    if (!idToDelete && url) {
      idToDelete = extractPublicIdFromUrl(url);
    }

    if (!idToDelete) {
      return NextResponse.json({ success: false, error: 'Could not extract valid publicId or URL.' }, { status: 400 });
    }

    // 3. Purge asset from Cloudinary securely
    const deleted = await deleteFromCloudinary(idToDelete);

    if (deleted) {
      return NextResponse.json({ success: true, message: 'Asset successfully destroyed on Cloudinary.' });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to destroy asset on Cloudinary.' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('API secure deletion error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
