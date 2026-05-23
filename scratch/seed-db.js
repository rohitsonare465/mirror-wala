const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Mirrorwala premium brand categories and products...');

  // 1. Clear existing data to be safe
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // 2. Create Categories
  const catLed = await prisma.category.create({
    data: {
      id: '65dfac02e345b123456789a1',
      name: 'LED Mirrors',
      slug: 'led-mirrors',
      description: 'Tri-color dimmable silhouette LED vanity mirrors with integrated anti-fog touch sensors.'
    }
  });

  const catDesigner = await prisma.category.create({
    data: {
      id: '65dfac02e345b123456789a2',
      name: 'Designer Mirrors',
      slug: 'designer-mirrors',
      description: 'Champagne gold irregular frames and vintage luxury carvings in premium fluid layouts.'
    }
  });

  const catArt = await prisma.category.create({
    data: {
      id: '65dfac02e345b123456789a3',
      name: 'Art Mirrors',
      slug: 'art-mirrors',
      description: 'Handcrafted black silhouette frames adorned with premium stained glass mosaic accents.'
    }
  });

  const catLuxury = await prisma.category.create({
    data: {
      id: '65dfac02e345b123456789a4',
      name: 'Luxury Mirrors',
      slug: 'luxury-mirrors',
      description: 'Faceted crystal glass borders lined with high-CRI sandblasted dual-glow LED strips.'
    }
  });

  const catBathroom = await prisma.category.create({
    data: {
      id: '65dfac02e345b123456789a5',
      name: 'Bathroom Mirrors',
      slug: 'bathroom-mirrors',
      description: 'Novelty vanity shapes, smart backlights, and professional cosmetics grooming outlines.'
    }
  });

  const catCustom = await prisma.category.create({
    data: {
      id: '65dfac02e345b123456789a6',
      name: 'Custom Mirrors',
      slug: 'custom-mirrors',
      description: 'Fluid organic contours finished in forest green high-gloss enamel for natural showroom vibes.'
    }
  });

  console.log('Categories seeded successfully.');

  // 3. Create Products
  await prisma.product.create({
    data: {
      id: '65dfac12e345b123456789ab',
      name: 'Galaxy Mosaic Art Mirror',
      slug: 'galaxy-mosaic-art-mirror',
      sku: 'MW-ART-GALAXY-01',
      price: 34000,
      salePrice: 29999,
      description: 'A masterpiece of stained glass art. The Galaxy Mosaic Mirror features a premium matte black silhouette frame adorned with hand-fused red, blue, and purple stained-glass accents. A mesmerizing focal point that transforms any space into an luxury interior showroom.',
      shortDescription: 'Masterpiece stained-glass artistic mirror with multi-color accents.',
      stock: 5,
      categoryId: catArt.id,
      LEDType: 'NONE',
      frameMaterial: 'Artisanal Hand-Fused Stained Glass & Matte Black Aluminum Frame',
      dimensions: '700mm x 1200mm x 6mm',
      images: ['/images/artistic_black.jpg', '/images/before_room.png'],
      featured: true,
      newArrival: true
    }
  });

  await prisma.product.create({
    data: {
      id: '65dfac22e345b123456789cd',
      name: 'Luxury LED Crystal Mirror',
      slug: 'luxury-led-crystal-mirror',
      sku: 'MW-LED-CRYSTAL-02',
      price: 48000,
      salePrice: 42500,
      description: 'The ultimate luxury statement piece. Featuring a spectacular irregular wavy profile lined with premium precision-cut crystal glass facets that reflect and amplify the integrated high-lumen dual-glow smart LED strip. Elevates your bathroom or designer dressing suite.',
      shortDescription: 'Spectacular wavy irregular LED vanity mirror with faceted crystal glass frame.',
      stock: 7,
      categoryId: catLuxury.id,
      LEDType: 'TRI_COLOR',
      frameMaterial: 'Anodized Champagne Gold Base Shield with Faceted Crystal Border',
      dimensions: '750mm x 1050mm x 5mm',
      images: ['/images/crystal_wavy.jpg', '/images/after_room.png'],
      featured: true,
      newArrival: true
    }
  });

  await prisma.product.create({
    data: {
      id: '65dfac32e345b123456789ef',
      name: 'Designer Gold Frame Mirror',
      slug: 'designer-gold-frame-mirror',
      sku: 'MW-DSN-GOLD-03',
      price: 42000,
      salePrice: 38000,
      description: 'Unparalleled organic form meets luxury baroque finishing. This irregular handcrafted masterpiece is finished in brilliant champagne gold leaf paint, offering a rich warm glow to any hallway or luxury living room fireplace.',
      shortDescription: 'Handcrafted irregular organic wood composite frame in gold leaf finish.',
      stock: 8,
      categoryId: catDesigner.id,
      LEDType: 'NONE',
      frameMaterial: 'Organic Wood Composite Frame in Champagne Gold Leaf Finish',
      dimensions: '800mm x 1100mm x 6mm',
      images: ['/images/designer_category.png', '/images/before_room.png'],
      featured: true,
      newArrival: false
    }
  });

  await prisma.product.create({
    data: {
      id: '65dfac42e345b12345678901',
      name: 'Aura Smart LED Bulb Mirror',
      slug: 'aura-smart-led-bulb-mirror',
      sku: 'MW-LED-AURA-04',
      price: 24000,
      salePrice: 19999,
      description: 'Playful silhouette meets smart engineering. Shaping a gorgeous lightbulb outline with high-lumen sandblasted LED dual-glow channels. Outfitted with touch sensor controls and a built-in demister. A stunning novelty statement for chic powder rooms.',
      shortDescription: 'Gorgeous bulb shape LED smart mirror with touch sensor dimming.',
      stock: 12,
      categoryId: catBathroom.id,
      LEDType: 'TRI_COLOR',
      frameMaterial: 'Slim Anodized Space Gray Aluminum Shield',
      dimensions: '650mm x 900mm x 5mm',
      images: ['/images/lightbulb_led.jpg', '/images/after_room.png'],
      featured: false,
      newArrival: true
    }
  });

  await prisma.product.create({
    data: {
      id: '65dfac52e345b12345678923',
      name: 'Designer Green Organic Mirror',
      slug: 'designer-green-organic-mirror',
      sku: 'MW-CST-GREEN-05',
      price: 28000,
      salePrice: 24500,
      description: "Celebrate nature's fluidity with this abstract organic leaf-shaped design. The frame is finished in a vibrant custom forest green high-gloss enamel, bringing natural luxury showroom vibes to elegant living spaces and cozy alcoves.",
      shortDescription: 'Abstract organic leaf accent mirror in brilliant high-gloss forest green frame.',
      stock: 10,
      categoryId: catCustom.id,
      LEDType: 'NONE',
      frameMaterial: 'Vibrant Forest Green Hand-Painted Solid Wood Frame',
      dimensions: '600mm x 1250mm x 6mm',
      images: ['/images/green_organic.jpg', '/images/before_room.png'],
      featured: false,
      newArrival: true
    }
  });

  await prisma.product.create({
    data: {
      id: '65dfac62e345b12345678945',
      name: 'Floral Engraved Modern Mirror',
      slug: 'floral-engraved-modern-mirror',
      sku: 'MW-LUX-FLORAL-06',
      price: 36000,
      salePrice: 32000,
      description: 'A breathtaking blend of classic engraving and contemporary glass art. Features delicate custom-etched floral and organic details around a clean modern minimalist design. Adds unmatched architectural sophistication to premium showrooms and bedrooms.',
      shortDescription: 'Premium modern frameless mirror with custom diamond-engraved floral trims.',
      stock: 6,
      categoryId: catLuxury.id,
      LEDType: 'NONE',
      frameMaterial: 'Frameless Diamond-Polished Premium Crystal Glass Edge',
      dimensions: '800mm x 1000mm x 5mm',
      images: ['/images/floral_engraved.jpg', '/images/after_room.png', '/images/before_room.png'],
      featured: false,
      newArrival: false
    }
  });

  console.log('Products seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
