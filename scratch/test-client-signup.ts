import { authClient } from '../src/lib/auth-client';

async function main() {
  console.log('Testing client signup using authClient...');
  const testEmail = `rohit.client.test.${Math.floor(Math.random() * 1000000)}@gmail.com`;

  try {
    const res = await authClient.signUp.email({
      email: testEmail,
      password: 'securePassword123',
      name: 'Rohit Client Test',
      phone: '9826258430',
      callbackURL: '/profile',
    });

    console.log('API Result:', res);
  } catch (error) {
    console.error('Error during client signup:', error);
  }
}

main();
