const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Testing User creation with non-hex string ID...');
  const testId = 'test_' + Math.random().toString(36).substring(2, 15);
  
  try {
    const user = await prisma.user.create({
      data: {
        id: testId,
        name: 'Test Rohit Sonare',
        email: `rohit.test.${Date.now()}@example.com`,
        password: 'hashed_password_123',
        role: 'USER',
        phone: '9826258430',
      }
    });
    console.log('✅ User successfully created in MongoDB!', user);
    
    // Clean up
    await prisma.user.delete({
      where: { id: user.id }
    });
    console.log('✅ Temporary test user successfully cleaned up!');
  } catch (error) {
    console.error('❌ User creation failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
