import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { AdminService } from '@/services/admin.service';
import { seoSchema } from '@/validations/admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isSitemap = searchParams.get('sitemap') === 'true';

    if (isSitemap) {
      const xmlData = await AdminService.generateSitemapXML();
      return new Response(xmlData, {
        headers: {
          'Content-Type': 'application/xml',
        },
      });
    }

    const key = searchParams.get('key');
    if (!key) {
      return NextResponse.json({ success: false, error: 'Key parameter is required' }, { status: 400 });
    }

    const content = await AdminService.getHomepageCMS(`seo:${key}`);
    return NextResponse.json({ success: true, data: content ? content.value : null });
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

    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ success: false, error: 'Key parameter is required to update SEO metadata' }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = seoSchema.parse(body);

    const result = await AdminService.updateSeoMetadata(key, validatedData);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
