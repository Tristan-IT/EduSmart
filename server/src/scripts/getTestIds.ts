import mongoose from 'mongoose';
import School from '../models/School.js';
import Class from '../models/Class.js';

async function getTestIds() {
  await mongoose.connect('mongodb://localhost:27017/adapti-portal');
  const school = await School.findOne({schoolName: /Test/i});
  const cls = await Class.findOne({school: school?._id});
  console.log('\n📋 Test Account IDs:');
  console.log('SchoolID:', school?.schoolId);
  console.log('ClassID:', cls?.classId);
  console.log('\n📧 Test Accounts:');
  console.log('School Owner: owner@test.com / test123');
  console.log('Teacher: teacher@test.com / test123');
  console.log('Student: student@test.com / test123');
  process.exit(0);
}

getTestIds();
