import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getClassAnalytics } from '../services/schoolAnalyticsService.js';
import UserModel from '../models/User.js';
import SchoolModel from '../models/School.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function testClassAnalytics() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/adapti_portal');
    console.log('✓ Connected to MongoDB');

    // Get school owner
    const owner = await UserModel.findOne({ email: 'kepala.sekolah@smktiglobal.sch.id' });
    console.log('Owner query result:', owner ? 'found' : 'not found');
    if (owner) {
      console.log('Owner details:', {
        name: owner.name,
        email: owner.email,
        ownedSchool: owner.ownedSchool,
        schoolId: owner.schoolId
      });
    }
    if (!owner || !owner.ownedSchool) {
      console.error('School owner not found or has no owned school');
      return;
    }

    // Get the school
    const school = await SchoolModel.findById(owner.ownedSchool);
    if (!school) {
      console.error('School not found');
      return;
    }

    const schoolId = school.schoolId;
    const ownerId = (owner._id as mongoose.Types.ObjectId).toString();

    console.log('Testing class analytics for school:', schoolId);

    // Get class analytics
    const classes = await getClassAnalytics(schoolId, ownerId);

    console.log('Class Analytics Results:');
    console.log('======================');

    // Filter and display XII classes
    const xiiClasses = classes.filter(cls =>
      cls.className.startsWith('XII')
    );

    console.log('XII Classes:');
    xiiClasses.forEach(cls => {
      console.log(`${cls.className}: ${cls.students.total}/${cls.students.max} students (${cls.students.percentage}%)`);
    });

    // Also show XI PPLG 1 for comparison
    const xiPplg1 = classes.find(cls =>
      cls.className === 'XI PPLG 1'
    );

    if (xiPplg1) {
      console.log(`\nXI PPLG 1: ${xiPplg1.students.total}/${xiPplg1.students.max} students (${xiPplg1.students.percentage}%)`);
    }

    console.log('\n✅ Test completed successfully!');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
  }
}

testClassAnalytics();