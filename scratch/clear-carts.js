const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Resetting/clearing all cart items in the database to fix the corrupted quantities...');
  const result = await prisma.cartItem.deleteMany({});
  console.log(`Successfully deleted ${result.count} corrupted cart items!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
