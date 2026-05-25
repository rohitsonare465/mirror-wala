const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Querying all accounts to see providers and password presence...');
  try {
    const accounts = await prisma.account.findMany({
      include: {
        user: true
      }
    });
    console.log(`Total accounts: ${accounts.length}`);
    accounts.forEach(acc => {
      console.log(`- User: ${acc.user.name} (${acc.user.email})`);
      console.log(`  Provider: ${acc.providerId}`);
      console.log(`  Has Password: ${acc.password ? 'Yes' : 'No'}`);
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
