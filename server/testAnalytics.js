import mongoose from 'mongoose';
import { getTeacherAnalytics } from './src/services/schoolAnalyticsService.js';
import UserModel from './src/models/User.js';
// Import models to register them
import './src/models/Subject.js';

async function testAnalytics() {
  try {
    await mongoose.connect('mongodb+srv://portal_db:ionMtId5RzD6xb4t@portal.0vma0yo.mongodb.net/adapti_portal?appName=Portal');

    // Get the school owner
    const owner = await UserModel.findOne({ email: 'kepala.sekolah@smktiglobal.sch.id' });
    if (!owner) {
      console.log('Owner not found');
      return;
    }

    console.log('Owner ID:', owner._id.toString());

    const result = await getTeacherAnalytics('SCH-00001', owner._id.toString());
    console.log('Total teachers returned:', result.length);

    if (result.length > 0) {
      console.log('First teacher:');
      console.log('  Name:', result[0].teacher.name);
      console.log('  Classes count:', result[0].classes.length);
      console.log('  Total students:', result[0].totalStudents);

      console.log('Second teacher:');
      console.log('  Name:', result[1].teacher.name);
      console.log('  Classes count:', result[1].classes.length);
      console.log('  Total students:', result[1].totalStudents);
    }

  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await mongoose.disconnect();
  }
}

testAnalytics();