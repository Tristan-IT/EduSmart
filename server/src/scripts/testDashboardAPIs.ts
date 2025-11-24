import https from 'https';

const BASE_URL = 'http://localhost:5000';
const SCHOOL_ID = 'SCH-00001';

// Mock token - in real scenario this would come from login
const TOKEN = 'your-jwt-token-here'; // We'll need to get this from actual login

function makeRequest(url: string, options: any = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (options.method === 'POST' && options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

async function testDashboardAPIs() {
  console.log('🧪 Testing School Dashboard APIs...\n');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`
  };

  try {
    // Test Overview API
    console.log('📊 Testing Overview API...');
    const overviewUrl = `${BASE_URL}/api/school-dashboard/overview?schoolId=${SCHOOL_ID}`;
    const overviewRes = await makeRequest(overviewUrl, { headers });

    if (overviewRes.status === 200) {
      console.log('✅ Overview API Success:');
      console.log('   - School:', overviewRes.data?.data?.school?.schoolName);
      console.log('   - Total Students:', overviewRes.data?.data?.totals?.students);
      console.log('   - Total Teachers:', overviewRes.data?.data?.totals?.teachers);
      console.log('   - Total Classes:', overviewRes.data?.data?.totals?.classes);
      console.log('   - Avg XP per Student:', overviewRes.data?.data?.averages?.xpPerStudent);
      console.log('   - Avg Level per Student:', overviewRes.data?.data?.averages?.levelPerStudent);
    } else {
      console.log('❌ Overview API Failed:', overviewRes.status);
      console.log('Response:', overviewRes.data);
    }

    // Test Alerts API
    console.log('\n🚨 Testing Alerts API...');
    const alertsUrl = `${BASE_URL}/api/school-dashboard/alerts?schoolId=${SCHOOL_ID}`;
    const alertsRes = await makeRequest(alertsUrl, { headers });

    if (alertsRes.status === 200) {
      console.log('✅ Alerts API Success:');
      console.log('   - Full Classes:', alertsRes.data?.data?.fullClasses);
      console.log('   - Inactive Students:', alertsRes.data?.data?.inactiveStudents);
      console.log('   - New Registrations:', alertsRes.data?.data?.newRegistrations);
    } else {
      console.log('❌ Alerts API Failed:', alertsRes.status);
      console.log('Response:', alertsRes.data);
    }

    // Test Performance API
    console.log('\n📈 Testing Performance API...');
    const performanceUrl = `${BASE_URL}/api/school-dashboard/performance?schoolId=${SCHOOL_ID}`;
    const performanceRes = await makeRequest(performanceUrl, { headers });

    if (performanceRes.status === 200) {
      console.log('✅ Performance API Success:');
      console.log('   - Completion Rate:', performanceRes.data?.data?.completionRate + '%');
      console.log('   - Average Score:', performanceRes.data?.data?.averageScore + '%');
      console.log('   - Engagement Rate:', performanceRes.data?.data?.engagementRate + '%');
    } else {
      console.log('❌ Performance API Failed:', performanceRes.status);
      console.log('Response:', performanceRes.data);
    }

    // Test Recent Activity API
    console.log('\n📅 Testing Recent Activity API...');
    const activityUrl = `${BASE_URL}/api/school-dashboard/recent-activity?schoolId=${SCHOOL_ID}&limit=5`;
    const activityRes = await makeRequest(activityUrl, { headers });

    if (activityRes.status === 200) {
      console.log('✅ Recent Activity API Success:');
      console.log('   - Activities found:', activityRes.data?.data?.length);
      if (activityRes.data?.data && activityRes.data.data.length > 0) {
        activityRes.data.data.forEach((activity: any, index: number) => {
          console.log(`   ${index + 1}. ${activity.message} (${activity.icon})`);
        });
      }
    } else {
      console.log('❌ Recent Activity API Failed:', activityRes.status);
      console.log('Response:', activityRes.data);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testDashboardAPIs();