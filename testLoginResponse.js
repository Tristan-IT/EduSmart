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

    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));

    if (response.ok && data.user) {
      console.log('schoolId in user object:', data.user.schoolId);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLogin();