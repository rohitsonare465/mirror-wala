const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.log('❌ Please provide an email address. Example: node scratch/promote-user.js your-email@gmail.com');
    process.exit(1);
  }

  console.log(`Searching for user with email: ${email}...`);
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    if (!user) {
      console.log(`❌ User with email ${email} not found! Please register the account first in the browser.`);
      return;
    }
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    });
    console.log(`✅ Success! User ${email} has been promoted to ADMIN!`, updatedUser);
  } catch (error) {
    console.error('❌ Error promoting user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
