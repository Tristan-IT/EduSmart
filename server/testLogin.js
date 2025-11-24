import fetch from 'node-fetch';

async function testLogin() {
  try {
    const response = await fetch('http://localhost:5000/api/school-owner/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'kepala.sekolah@smktiglobal.sch.id',
        password: 'made123'
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Login successful!');
      console.log('Response:', data);
    } else {
      console.log('Login failed:', data);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLogin();