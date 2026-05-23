import { PrismaClient, LedColorType } from '@prisma/client';

const prisma = new PrismaClient();

const newProducts = [
  {
    name: 'Aura Gold Circular Luxury Backlit Smart Mirror',
    slug: 'aura-gold-circular-luxury-backlit-smart-mirror',
    description: 'Adorn your vanity space with the ultimate expression of luxury. Features a handcrafted textured gold-leaf interior rim lit by high-CRI warm-white LEDs. Includes dynamic touch sensor controls for dimming and active anti-fog technology.',
    shortDescription: 'Circular smart mirror with textured gold foil rim and warm tri-color LED backlighting.',
    sku: 'MW-RND-GLD-AURA',
    price: 24500.0,
    salePrice: 19800.0,
    stock: 15,
    categoryId: '65dfac02e345b123456789a4', // Luxury Mirrors
    featured: true,
    newArrival: true,
    images: ['/images/gold_aura_circular_mirror.png'],
    LEDType: LedColorType.TRI_COLOR,
    frameMaterial: 'Gold Foil Textured Rim',
    dimensions: '800x800mm',
  },
  {
    name: 'Luxe Full-Length Leaning Smart Floor Mirror',
    slug: 'luxe-full-length-leaning-smart-floor-mirror',
    description: 'A stunning minimalist tall rectangular floor-leaning mirror with elegant rounded corners. Emits a smooth, ambient warm-white glow from behind, turning any bedroom or dressing space into a high-end luxury sanctuary.',
    shortDescription: 'Full-length floor leaning mirror with warm-white backlighting and minimal rounded corners.',
    sku: 'MW-FLR-LNZ-BEG',
    price: 28000.0,
    salePrice: 23500.0,
    stock: 10,
    categoryId: '65dfac02e345b123456789a2', // Designer Mirrors
    featured: true,
    newArrival: true,
    images: ['/images/luxe_floor_leaning_mirror.png'],
    LEDType: LedColorType.WARM_WHITE,
    frameMaterial: 'Sleek Aluminum',
    dimensions: '600x1800mm',
  },
  {
    name: 'Verona Oval Smart LED Vanity Mirror',
    slug: 'verona-smart-oval-led-vanity-mirror',
    description: 'Create a luxurious cosmetics-grooming environment with this oval vanity masterwork. Framed in elegant brass gold borders, it features dual-glow sandblasted lighting, three dimmable light cycles, and full touch-sensor integration.',
    shortDescription: 'Chic oval smart touch mirror featuring custom warm tri-color dimming.',
    sku: 'MW-OVL-VRN-MAR',
    price: 22000.0,
    salePrice: 18500.0,
    stock: 20,
    categoryId: '65dfac02e345b123456789a5', // Bathroom Mirrors
    featured: false,
    newArrival: true,
    images: ['/images/verona_oval_vanity_mirror.png'],
    LEDType: LedColorType.TRI_COLOR,
    frameMaterial: 'Frameless Polished',
    dimensions: '700x900mm',
  },
  {
    name: 'Imperial Capsule Backlit Dressing Mirror',
    slug: 'imperial-capsule-backlit-dressing-mirror',
    description: 'The pinnacle of contemporary architecture. A bold, capsule-shaped wall mirror featuring seamless natural white backlighting. Mounts perfectly above console tables or inside corridors to add dramatic architectural depth.',
    shortDescription: 'Capsule shaped back-lit wall mirror with natural white ambient lighting.',
    sku: 'MW-CAP-IMP-WD',
    price: 26000.0,
    salePrice: 21900.0,
    stock: 12,
    categoryId: '65dfac02e345b123456789a1', // LED Mirrors
    featured: true,
    newArrival: true,
    images: ['/images/imperial_capsule_mirror.png'],
    LEDType: LedColorType.NATURAL_WHITE,
    frameMaterial: 'Frameless Frosted Edge',
    dimensions: '800x1400mm',
  },
  {
    name: 'Aero Organic Custom Backlit Wall Mirror',
    slug: 'aero-organic-custom-backlit-wall-mirror',
    description: 'Make a highly personalized design statement in your master bath. Features custom sandblasted glowing butterfly patterns etched directly onto high-fidelity glass, illuminated with fluid tri-color ambient backing.',
    shortDescription: 'Fluid shape organic mirror with custom sandblasted butterfly patterns.',
    sku: 'MW-ORG-AER-BUT',
    price: 29500.0,
    salePrice: 24900.0,
    stock: 8,
    categoryId: '65dfac02e345b123456789a6', // Custom Mirrors
    featured: false,
    newArrival: true,
    images: ['/images/aero_organic_custom_mirror.png'],
    LEDType: LedColorType.TRI_COLOR,
    frameMaterial: 'Organic Contour Frameless',
    dimensions: '900x1100mm',
  },
];

async function main() {
  console.log('Starting seed process for new mirrors...');

  for (const product of newProducts) {
    const createdProduct = await prisma.product.upsert({
      where: { sku: product.sku },
      update: product,
      create: product,
    });
    console.log(`Successfully upserted product: ${createdProduct.name} (SKU: ${createdProduct.sku})`);
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
