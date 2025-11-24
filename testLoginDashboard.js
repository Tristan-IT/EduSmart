const testLoginAndDashboard = async () => {
  try {
    console.log('Testing school owner login...');

    // Login
    const loginResponse = await fetch('http://localhost:5000/api/school-owner/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'kepala.sekolah@smktiglobal.sch.id',
        password: 'made123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);

    if (!loginData.success) {
      console.error('Login failed:', loginData.message);
      return;
    }

    const token = loginData.token;
    const schoolId = loginData.user.schoolId;

    console.log('Token:', token ? '✓' : '✗');
    console.log('School ID:', schoolId);

    // Test dashboard API
    console.log('Testing dashboard overview API...');
    const overviewResponse = await fetch(`http://localhost:5000/api/school-dashboard/overview?schoolId=${schoolId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const overviewData = await overviewResponse.json();
    console.log('Overview API response:', overviewData);

    if (overviewData.success) {
      console.log('Dashboard data loaded successfully!');
      console.log('School:', overviewData.data.school);
      console.log('Totals:', overviewData.data.totals);
    } else {
      console.error('Dashboard API failed:', overviewData.message);
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
};

testLoginAndDashboard();