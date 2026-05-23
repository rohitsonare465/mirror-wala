import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mirrorwala.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/checkout',
        '/cart',
        '/profile',
        '/orders',
        '/reset-password',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
