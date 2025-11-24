import fetch from 'node-fetch';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTI0NTBjOTk5MTZjMjZmMzBhMjJkMTkiLCJyb2xlIjoic2Nob29sX293bmVyIiwibmFtZSI6IkkgTWFkZSBJbmRyYSBBcmliYXdhLCBTSCIsImVtYWlsIjoia2VwYWxhLnNla29sYWhAc21rdGlnbG9iYWwuc2NoLmlkIiwiaWF0IjoxNzYzOTkwMTAxLCJleHAiOjE3NjQ1OTQ5MDF9.TOZlQSpO73aVnheQYS8KVAB3uPRCQVfh-_KGdA_D6Tk';
const schoolId = 'SCH-00001';

async function testDashboard() {
  try {
    console.log('Testing school dashboard overview...');
    const overviewResponse = await fetch(`http://localhost:5000/api/school-dashboard/overview?schoolId=${schoolId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const overviewData = await overviewResponse.json();
    console.log('Overview Response:', JSON.stringify(overviewData, null, 2));

    console.log('\nTesting school dashboard teachers...');
    const teachersResponse = await fetch(`http://localhost:5000/api/school-dashboard/teachers?schoolId=${schoolId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const teachersData = await teachersResponse.json();
    console.log('Teachers Response:', JSON.stringify(teachersData, null, 2));

    console.log('\nTesting school dashboard classes...');
    const classesResponse = await fetch(`http://localhost:5000/api/school-dashboard/classes?schoolId=${schoolId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const classesData = await classesResponse.json();
    console.log('Classes Response:', JSON.stringify(classesData, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testDashboard();