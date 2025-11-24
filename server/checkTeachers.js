import mongoose from 'mongoose';
import UserModel from './src/models/User.js';
import SchoolModel from './src/models/School.js';

async function checkTeachers() {
  try {
    await mongoose.connect('mongodb+srv://portal_db:ionMtId5RzD6xb4t@portal.0vma0yo.mongodb.net/adapti_portal?appName=Portal');

    // Find the school first
    const school = await SchoolModel.findOne({ schoolName: 'SMK TI Bali Global Badung' });
    if (!school) {
      console.log('School not found');
      return;
    }

    console.log('School ID:', school._id.toString());

    const teachers = await UserModel.find({ role: 'teacher', school: school._id }).select('name teacherProfile').limit(5);

    console.log('Total teachers found:', teachers.length);
    teachers.forEach((teacher, index) => {
      console.log('Teacher ' + (index + 1) + ': ' + teacher.name);
      console.log('  Classes assigned: ' + (teacher.teacherProfile?.classes?.length || 0));
      console.log('  Class IDs: ' + (teacher.teacherProfile?.classIds?.length || 0));
      if (teacher.teacherProfile?.classes?.length > 0) {
        console.log('  Sample class: ' + teacher.teacherProfile.classes[0].className);
      }
      console.log('---');
    });

  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkTeachers();