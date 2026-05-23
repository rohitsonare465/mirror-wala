const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const targetEmail = 'rohitsonare465@gmail.com';
  console.log(`Promoting user ${targetEmail} to ADMIN...`);
  try {
    const user = await prisma.user.findUnique({
      where: { email: targetEmail }
    });
    if (!user) {
      console.log(`❌ User with email ${targetEmail} not found! Please register first via the UI or API.`);
      return;
    }
    const updatedUser = await prisma.user.update({
      where: { email: targetEmail },
      data: { role: 'ADMIN' }
    });
    console.log('✅ User successfully promoted to ADMIN!', updatedUser);
  } catch (error) {
    console.error('❌ Error updating user role:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
