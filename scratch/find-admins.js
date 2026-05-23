const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Querying all users to see if any have the ADMIN role...');
  try {
    const users = await prisma.user.findMany();
    console.log(`Total users in DB: ${users.length}`);
    users.forEach(u => {
      console.log(`- ID: ${u.id}, Name: ${u.name}, Email: ${u.email}, Role: ${u.role}`);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
