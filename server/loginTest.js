async function loginSchoolOwner() {
  try {
    const response = await fetch('http://localhost:5000/api/school-owner/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'kepala.sekolah@smktiglobal.sch.id',
        password: 'password123' // Default password from seeding
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Login successful!');
      console.log('Token:', data.token);
      console.log('User:', JSON.stringify(data.user, null, 2));

      // Instructions for manual setup
      console.log('\nTo manually set authentication in browser console:');
      console.log(`localStorage.setItem('token', '${data.token}');`);
      console.log(`localStorage.setItem('schoolId', '${data.user.schoolId}');`);
      console.log('Then refresh the dashboard page.');
    } else {
      console.log('Login failed:', data.message);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

loginSchoolOwner();