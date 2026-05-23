const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Checking database...');
  const categories = await prisma.category.findMany();
  console.log('Categories in DB:', categories);

  const products = await prisma.product.findMany();
  console.log('Products in DB:', products);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
