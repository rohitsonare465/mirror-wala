import React from 'react';

interface ProductSchemaProps {
  product: {
    id: string;
    name: string;
    description: string;
    sku: string;
    price: number;
    salePrice?: number | null;
    images: string[];
    categoryName: string;
    stock: number;
    LEDType?: string;
    frameMaterial?: string | null;
    dimensions?: string | null;
  };
}

export default function ProductSchema({ product }: ProductSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mirrorwala.com';
  const finalPrice = product.salePrice ?? product.price;
  const availability = product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name,
    'image': product.images,
    'description': product.description,
    'sku': product.sku,
    'mpn': product.sku,
    'brand': {
      '@type': 'Brand',
      'name': 'Mirrorwala',
    },
    'category': product.categoryName,
    'offers': {
      '@type': 'Offer',
      'url': `${baseUrl}/products/${product.sku.toLowerCase()}`,
      'priceCurrency': 'INR',
      'price': finalPrice,
      'priceValidUntil': new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      'itemCondition': 'https://schema.org/NewCondition',
      'availability': availability,
      'seller': {
        '@type': 'LocalBusiness',
        'name': 'Mirrorwala Showroom Indore',
      },
    },
    'additionalProperty': [
      {
        '@type': 'PropertyValue',
        'name': 'LED Illumination',
        'value': product.LEDType || 'NONE',
      },
      {
        '@type': 'PropertyValue',
        'name': 'Frame Material',
        'value': product.frameMaterial || 'Frameless',
      },
      {
        '@type': 'PropertyValue',
        'name': 'Available Sizes',
        'value': product.dimensions || 'Standard',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
