const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const emails = ['gorishi723@gmail.com', 'sujal@gmail.com'];
  console.log(`Promoting users to ADMIN: ${emails.join(', ')}`);
  
  for (const email of emails) {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });
      if (!user) {
        console.log(`❌ User with email ${email} not found!`);
        continue;
      }
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' }
      });
      console.log(`✅ User ${email} successfully promoted to ADMIN!`, updatedUser);
    } catch (error) {
      console.error(`❌ Error updating user role for ${email}:`, error);
    }
  }
  await prisma.$disconnect();
}

main();
