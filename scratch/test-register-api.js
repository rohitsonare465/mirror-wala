async function testRegistrationAPI() {
  console.log('Sending manual registration request to running dev server...');
  const testEmail = `rohit.test.${Math.floor(Math.random() * 1000000)}@gmail.com`;
  
  const payload = {
    email: testEmail,
    password: 'securePassword123',
    name: 'Rohit Sonare Test',
    phone: '9826258430'
  };

  try {
    const response = await fetch('http://localhost:3000/api/auth/sign-up/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000',
        'Host': 'localhost:3000',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('Status Code:', response.status);
    console.log('Response Payload:', data);

    if (response.ok) {
      console.log('✅ Registration API successfully completed! Better Auth created the user in local MongoDB.');
    } else {
      console.error('❌ Registration API failed:', data);
    }
  } catch (error) {
    console.error('❌ Network request error:', error);
  }
}

testRegistrationAPI();
